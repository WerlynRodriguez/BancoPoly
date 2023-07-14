import React from 'react'
import WrapperList from '../../components/WrapperList'
import Auth from '../../store/auth'

/** The Section of PanelEntity
 * @type {React.FC<{
 * asABank: boolean,
 * onSelect: (name: string) => void,
 * players: { [name: string]: { inGame: boolean } }
 * }>}
 * @returns {JSX.Element} - The Section of PanelEntity
 **/
const PanelEntity = React.memo(({ asABank, onSelect, players }) => {

    return (
        <React.Fragment>
            <div 
                className='btn' 
                style={{ width: "100%" }}
                onClick={() => onSelect(-1)}// -1 is the bank, because someone can have a name of 'bank'
            >
                <h3> {asABank ? Auth.getName() : "Banco"} </h3>
            </div>

            <h2> Personas </h2>
            <WrapperList
                data={Object.keys(players)}
                item={(item, index) => (
                    <div
                        key={index}
                        className='btn'
                        style={{ width: "30%" }}
                        onClick={() => onSelect(item)}
                    >
                        <span className={"dot " + (!players[item].inGame && "off")}></span>
                        <h3> {item} </h3>
                    </div>
                )}
            />
        </React.Fragment>
    )
})

export default PanelEntity