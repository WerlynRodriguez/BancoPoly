import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useConectionStore } from "../store/conection"
import { useGameStore } from "../store/game"
import { useEffect } from "react"
import socket from "../store/Socket"
import { toast } from "sonner"
import Auth from "../store/auth"
import { getNameFromData } from "../items/Card"

/** Protect routes that need to be accessed only when the user is Conected */
export function ConnectedProt() {
    const { pathname } = useLocation()
    const Connected = useConectionStore(state => state.Connected)

    const isInGame = useGameStore(state => state.isInGame)
    const setInGame = useGameStore(state => state.setInGame)

    useEffect(() => { 
        // separate by "/" and get the first element
        const path = pathname.split("/")[1 || 0]
        if (path !== 'room' && isInGame) {
            setInGame(false)
            socket.emit('leaveGame')
        }

     }, [pathname])

    if (Connected) return <Outlet />
    return <Navigate to='/' />
}

/** This function is used to protect the routes that need authentication */
export function AuthProt() {
    const isLogged = useConectionStore(state => state.isLogged)

    if (isLogged) return <Outlet />
    else return <Navigate to='/login' />
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

/** This function is used to protect the routes that need to be accessed 
 * only when the user is in a game and controlls some events */
export function GameProt(){
    const [
        isInGame,
        setInGame,
        GameState,
        addMoney,
        addNotif,
        updateGameState,
        addPlayer,
        deletePlayer,
        updatePlayerInGame,
        addProperty,
      ] = useGameStore(state => [
        state.isInGame,
        state.setInGame,
        state.GameState,
        state.addMoney,
        state.addNotif,
        state.updateGameState,
        state.addPlayer,
        state.deletePlayer,
        state.updatePlayerInGame,
        state.addProperty,
      ])
      

    /** @param {{type: string, name: string}} data */
    const updatePlayers = (data) => {
        const { type, name, newOwner } = data

        if (type === 'add') {

            addPlayer(name)
            toast(`${name} entró al juego`)

        } else if (type === 'reEnter') {

            updatePlayerInGame(name, true)
            toast(`${name} volvió al juego`)

        } else if (type === 'delete') {

            deletePlayer(name)
            if (newOwner == Auth.getName()) {
                updateGameState('isMeBank', true)
                toast(`${name} salió del juego, ahora eres el dueño`)
            } else
                toast(`${name} salió del juego`)

        } else {

            updatePlayerInGame(name, false)
            if (newOwner == Auth.getName()) {
                updateGameState('isMeBank', true)
                toast(`${name} se desconectó, ahora eres el dueño`)
            } else
                toast(`${name} se desconectó`)

        }
    }

    const onIncomeMoney = (data) => {
        const { amount, entity } = data

        addMoney(amount)
        addNotif(0, amount, entity, getTimeAmPm())
        toast.success(`${entity} te pagó $${amount}`)
    }

    const onIncomeProperty = (data) => {
        const {type, id, entity} = data

        const nameProperty = getNameFromData[type](id)
        addProperty(type == 0 ? 'properties' : type == 1 ? 'utilities' : 'railRoads', id)
        toast.success(`Recibiste ${nameProperty} de ${entity}`)
        addNotif(0, nameProperty, entity, getTimeAmPm())

    }

    const onStartGame = () => {
        updateGameState('gameStatus', 1)
        toast.success('El juego ha comenzado')
    }

    const onBanned = () => setInGame(false)

    useEffect(() => {
        socket.on('updatePlayers', updatePlayers)
        socket.on('incomeMoney', onIncomeMoney)
        socket.on('incomeProperty', onIncomeProperty)
        socket.on('startGame', onStartGame)
        socket.on('banned', onBanned)

        return () => {
            socket.off('updatePlayers', updatePlayers)
            socket.off('incomeMoney', onIncomeMoney)
            socket.off('incomeProperty', onIncomeProperty)
            socket.off('startGame', onStartGame)
            socket.off('banned', onBanned)
        }
    }, [])

    if (isInGame) return <Outlet />
    else return <Navigate to='/home' />
}