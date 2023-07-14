import React, { useEffect, useRef, useState } from 'react'
import { 
    CardNotif, 
    CardProperty, 
    CardRailRoad, 
    CardUtility, 
    getNameFromData
} from '../items/Card'
import { toast } from 'sonner'
import socket from '../store/Socket'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useGameStore } from '../store/game'

import PanelEntity from './Room/PanelEntity'
import PanelProperty from './Room/PanelProperty'
import { 
    IcnDocument, 
    IcnDollar, 
    IcnMenu, 
    IcnProperty, 
    IcnWorld 
} from '../assets/Icons'
import WrapperList from '../components/WrapperList'
import { errorPayMoney, bankStatus } from './Room/RoomLang'
import { PanelWaiting } from './Room/PanelStatus'

import 'react-tabs/style/react-tabs.css'
import '../components/Dialog.css'
import "./Room.css"
import { useNavigate } from 'react-router-dom'
import CondRender from '../components/CondRender'
import Auth from '../store/auth'

export async function Loader(){
    return null;
}

export function Room() {
    const navigate = useNavigate()

    const [isloading, setIsLoading] = useState(false)
    const dialogTransactRef = useRef(null)
    const dialogPropertiesRef = useRef(null)
    const dialogMenuRef = useRef(null)

    const [selTab, setSelTab] = useState(0) 

    const [selProperty, setSelProperty] = useState(-1)
    const [selTabProperties, setSelTabProperties] = useState(0) // 0: properties, 1: utilities, 2: railroads
    const [selPlayer, setSelPlayer] = useState(-2)

    const [asABank, setAsABank] = useState(false)

    /** @type {{money: number, properties: number[], railRoads: number[], utilities: number[], players: {[key: string]: any}, notif: string[], isMeBank: boolean, gameStatus: number}} */
    const GameState = useGameStore(state => state.GameState)

    const deleteProperty= useGameStore(state => state.deleteProperty)

    useEffect(() => {
        document.onclick = (e) => {
            if (e.target === dialogTransactRef.current) {
                dialogTransactRef.current.close()
                setSelPlayer(-2)
            } else if (e.target === dialogPropertiesRef.current) {
                dialogPropertiesRef.current.close()
                setSelProperty(-1)
            } else if (e.target === dialogMenuRef.current) {
                dialogMenuRef.current.close()
            }
        }

        return () => { document.onclick = null }
    }, [])


    /** Add a notification to the GameState
     * @type {(type: number, amount: number, entity: string) => void} 
     **/
    const addNotif = useGameStore(state => state.addNotif)

    /** Update any of GameState properties
     * @type {(key: string, value: any) => void} 
     **/
    const updateGameState = useGameStore(state => state.updateGameState)

    const removeMoney = useGameStore(state => state.removeMoney)

    /** Check if the user can do actions 
     * @returns {boolean} - True if the user can do actions
     **/
    const canDoActions = () =>  !isloading && GameState.gameStatus === bankStatus.playing

    /** Get the name of the entity selected
     * @returns { string } - The name of the entity
     **/
    const getNameFromEnt = () => selPlayer === -1 ? 'Banco' : selPlayer

    /** When click on a person 
     * @param {string | number} entity - The entity name or -1 for the bank
     **/
    const onCTransact = (index) => {
        setSelPlayer(index);
        dialogTransactRef.current.showModal();
    }

    const getTimeAmPm = () => {
        const date = new Date();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    /** Send money
     * @param {number} amount - The amount of money to send
     * @param {React.FormEvent<HTMLFormElement> | null} event - The event of the form
     **/
    const sendMoney = (amount, event = null) => {
        socket.emit('payMoney',{ entity: selPlayer, amount: amount, asABank: asABank },
        (data) => {
            const { error, isBank } = data
            if (error) {
                toast.error(errorPayMoney[error])
                setIsLoading(false)
                return
            }
            
            if (isBank == undefined) {
                removeMoney(amount)
                addNotif(1, amount, getNameFromEnt(), getTimeAmPm())
                toast.error(`Pagaste $${amount} a ${getNameFromEnt()}`)
            } else if (isBank) toast('Banco pagó $' + amount + ' a ' + getNameFromEnt())

            if (event) event.target.reset()
            dialogTransactRef.current.close()
            setIsLoading(false)
        })
    }

    /** When sumbit the transaction form
     * @param {React.FormEvent<HTMLFormElement>} event
     **/
    const onSubmitTransact = (event) => {
        event.preventDefault()
        if (!canDoActions()) return
        setIsLoading(true)

        const data = new FormData(event.target)
        const amount = parseInt(data.get('amount').toString())

        sendMoney(amount, event)
    }

    /** When sumbit the send property form
     * @param {React.FormEvent<HTMLFormElement>} event
     **/
    const onSendProperty = (event) => {
        event.preventDefault()
        if (!canDoActions()) return
        setIsLoading(true)

        const data = new FormData(event.target)
        const entity = data.get('entity').toString()

        socket.emit('sendProperty', { 
            id: selProperty, type: selTabProperties, entity: entity, asABank: asABank
        }, (data) => {
            const { error, isBank, entity } = data
            setIsLoading(false)

            if (error) {
                toast.error(error)
                return
            }

            const nameProperty = getNameFromData[selTabProperties](selProperty)

            if (!isBank){
                deleteProperty(
                    selTabProperties === 0 ? 'properties' : 
                    selTabProperties === 1 ? 'utilities' : 'railRoads', 
                    selProperty
                )
                toast.error(`Enviaste ${nameProperty} a ${entity}`)
                addNotif(1, nameProperty, entity, getTimeAmPm())
            }

            dialogPropertiesRef.current.close()
        })
    }

    /** When click on a property
     * @param {number} id - The property id
     **/
    const onSelectProperty = (id) => {
        setSelProperty(id)
        dialogPropertiesRef.current.showModal()
    }

    if (GameState.gameStatus === bankStatus.waiting) 
        return (
            <PanelWaiting 
            players={Object.keys(GameState.players)} 
            isMeBank={GameState.isMeBank} />
        )

    return (
    <React.Fragment>
    <header>
        <button className='icon' onClick={()=>{dialogMenuRef.current.showModal()}}> <IcnMenu /> </button>
        <h1> ${GameState.money} </h1>
    </header>
    <div className="resLayout">

        <Tabs 
            selectedIndex={selTab}
            onSelect={index => setSelTab(index)}
            focusTabOnClick={false}
            disableLeftRightKeys={true}
            disableUpDownKeys={true}
            style={{ width: "100%" }} 
            selectedTabClassName='selectedTab'>
            <TabList>
                <Tab> Propiedades </Tab>
                <Tab> Transacciones </Tab>
                <Tab> Entidades </Tab>
            </TabList>

            
            <TabPanel>
                <PanelProperty
                    asABank={asABank}
                    properties={GameState.properties}
                    railRoads={GameState.railRoads}
                    utilities={GameState.utilities}
                    onSelect={onSelectProperty}
                    selTabProperties={selTabProperties}
                    setSelTabProperties={setSelTabProperties}
                />
            </TabPanel>
            
            <TabPanel>
                <WrapperList
                    data={GameState.notif}
                    item={(item, index) => (
                        <CardNotif key={index} {...item} />
                    )}
                />
            </TabPanel>
            
            <TabPanel>
                <PanelEntity
                    asABank={asABank}
                    players={GameState.players}
                    onSelect={onCTransact}
                />
            </TabPanel>
        </Tabs>
    </div>
    <footer>
        <button className='icon' onClick={()=>{setSelTab(0)}}> 
            <IcnDocument/> Propiedades
        </button>
        <button className='icon' onClick={()=>{setSelTab(1)}}> 
            <IcnDollar/> Transacciones
        </button>
        <button className='icon' onClick={()=>{setSelTab(2)}} >
            <IcnProperty/> Entidades
        </button>

        <CondRender condition={GameState.isMeBank}>
            <button className={'icon ' + (asABank && 'bank')}
            onDoubleClick={()=>{setAsABank(!asABank)}}>
                <IcnWorld/> {asABank ? "Banco'nt" : 'Ser banco'}
            </button>
        </CondRender>
    </footer>


    <dialog className='react-dialog' ref={dialogTransactRef}>
        <CondRender condition={selPlayer !== -2}>
            <h2> { selPlayer === -1 ? "Banco" : selPlayer } </h2>
        </CondRender>

        <span className='divider' />

        <CondRender condition={asABank}>
            <CondRender condition={selPlayer !== -2 & selPlayer !== -1}>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1rem',
                    }}
                >
                    <button 
                        className='bank' 
                        onDoubleClick={() => {
                            if (!canDoActions()) return
                            setIsLoading(true)
                            sendMoney(200)
                        }}
                    >
                        Pagar Go
                    </button>

                    <button 
                        className='bank'
                        title='Doble click para expulsar al jugador'
                        onDoubleClick={() => {
                            socket.emit("banned", selPlayer)
                            dialogTransactRef.current.close()
                            setSelPlayer(-2)
                        }}>
                        Expulsar 
                    </button>
                </div>
            </CondRender>
        </CondRender>

        <form onSubmit={onSubmitTransact}>
            <label htmlFor='amount'> Monto </label>
            <input
                required
                autoFocus
                type='number'
                inputMode='numeric'
                name='amount'
                placeholder='Monto a pagar'
                min={2}
                max={ asABank ?  5000 : GameState.money }
                pattern="[0-9]+"
            />
            <input 
                className={'btn ' + (asABank ? 'bank' : 'danger')}
                type='submit' 
                value='Pagar'
            />
        </form>

        <span className='divider' />

        <button
            onClick={() => {
                dialogTransactRef.current.close()
                setSelPlayer(-2)
            }}
        > Cerrar </button>
    </dialog>


    <dialog className='react-dialog' ref={dialogPropertiesRef}>
        <CondRender condition={selProperty !== -1}>
            {selTabProperties === 0 ?
                <CardProperty id={selProperty} /> 
            : selTabProperties === 1 ?
                <CardUtility id={selProperty} /> 
            :
                <CardRailRoad id={selProperty} />
            }

            <span className='divider' />

            <form onSubmit={onSendProperty}>
                <label htmlFor='entity'> Enviar a </label>
                <select
                    required
                    autoFocus
                    name='entity'
                    defaultValue={-1}
                >
                    <option value={-1}> {asABank ? Auth.getName() : 'Banco'} </option>
                    {Object.keys(GameState.players).map((player, index) => (
                        <option key={index} value={player}> {player} </option>
                    ))}
                </select>

                <input
                    type='submit'
                    className='danger btn'
                    value={'Enviar' + (asABank ? ' como banco' : '')}
                />
            </form>
        </CondRender>

        <button
            onClick={() => { 
                dialogPropertiesRef.current.close()
                setSelProperty(-1)
            }}
        > Cerrar </button>
    </dialog>

    <dialog className='react-dialog' ref={dialogMenuRef}>
        <button className='danger' onClick={() => { navigate('/home', {replace:true}) }}> Salir </button>
        <button onClick={() => { dialogMenuRef.current.close() }}> Cerrar </button>
    </dialog>
    </React.Fragment>
    )
}