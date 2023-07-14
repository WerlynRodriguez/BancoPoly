import { useNavigate } from "react-router-dom"
import WrapperList from "../../components/WrapperList"
import socket from "../../store/Socket"
import React from "react"

/** @param {{players: string[], isMeBank: boolean}} props */
export function PanelWaiting({ players, isMeBank }) {
    const navigate = useNavigate()
    return (
        <div className="resLayout">
            <h1>Esperando a que el banco inicie</h1>

            <label htmlFor="count">Jugadores: {players.length + 1}/8</label>
            <progress style={{ width: "100%", height: "20px"}}
                id="count" max="8" value={players.length + 1}
            />

            <WrapperList
                data={players}
                item={(item, index) => (
                    <div
                        key={index}
                        className='btn'
                        style={{ width: "30%" }}
                    >
                        <h3> {item} </h3>
                    </div>
                )}
            />

            { isMeBank && players.length >= 1 &&
                <button
                    className="float br"
                    onClick={() => {socket.emit('startGame')}}
                > 
                    Iniciar 
                </button>
            }

            <button
                className="danger float bl" 
                onClick={() => {navigate('/home')}}
            > 
                Salir 
            </button>
        </div>
    )
}

export function PanelAsBank(){
    return (
    <React.Fragment>
        <button></button>
    </React.Fragment>
    )
}