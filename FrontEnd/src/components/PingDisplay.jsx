import { useEffect, useState } from "react"
import { useConectionStore } from "../store/conection"
import socket from "../store/Socket"
import "./PingDisplay.css"


/** Display the current ping of the user 
*/
export default function PingDisplay() {
    const [ping, setPing] = useState(300)
    const Connected = useConectionStore(state => state.Connected)
    const setConnected = useConectionStore(state => state.setConnected)
    const setLogged = useConectionStore(state => state.setLogged)
    
    useEffect(() => {
        let interval = null
        
        if (Connected)
            interval = setInterval(() => {
                const start = Date.now()

                socket.emit('Ping', () => {
                    setPing(Date.now() - start)
                })
            }, 5000)
        else { setLogged(false) }

        return () => { if (interval) clearInterval(interval) }
    }, [Connected])

    useEffect(() => {
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
        }
    }, [])

    const onConnect = () => { setConnected(true) }
    const onDisconnect = () => { setConnected(false) }

    const getColorDot = () => {
        if (ping < 100) return 'rgba(0, 255, 0, 0.6)'
        else if (ping < 200) return 'rgba(255, 255, 0, 0.6)'
        else return 'rgba(255, 0, 0, 0.6)'
    }

    return (
        <div className='ping-display'>
            {!Connected ?
                <>
                    <span className='dot rec'></span>
                    Desconectado
                </>
                :
                <>
                    <span className='dot' style={{ backgroundColor: getColorDot() }}></span>
                    {ping} ms
                </>
            }
        </div>
    )
}