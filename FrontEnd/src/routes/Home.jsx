import { useNavigate } from "react-router-dom"
import socket from "../store/Socket"
import Auth from "../store/auth"
import { useConectionStore } from "../store/conection"
import { useGameStore } from "../store/game"
import { useState } from "react"
import { toast } from "sonner"
import { IcnExpand, IcnOff, IcnPlay } from "../assets/Icons"

const errorsEnterGame = [
    "Maximo de jugadores alcanzado",
    "No perteneces a este juego",
    "El juego ya ha comenzado",
    "Ya estas en este juego?"
]

function ButtonMenu(props){
    const { icon = null, text = "" } = props
    return (
        <button
            {...props}
            className={`icon ${props.className}`} 
            style={{
                width: '30vw',
                maxWidth: '40vh',
                marginTop: '20px',
            }}
        >
            {icon}
            {text}
        </button>
    )
}

/** This function render the home page */
export function Home() {
    const navigate = useNavigate()
    const setLogged = useConectionStore(state => state.setLogged)
    const [isLoading, setLoading] = useState(false)

    const setInGame = useGameStore(state => state.setInGame)
    const setGameState = useGameStore(state => state.setGameState)

    const onClickLogout = () => {
        if (isLoading) return
        setLoading(true)
        socket.emit('Logout', onLogout)
    }

    const onClickEnter = () => {
        if (isLoading) return
        setLoading(true)
        socket.emit('requestEnterGame', onEnter)
    }

    const onLogout = () => {
        Auth.removeName()
        Auth.removeToken()
        setLogged(false)
    }

    const onEnter = (data) => {
        const { error } = data
        if (error) {
            toast.error(errorsEnterGame[error])
            setLoading(false)
            return
        }

        setInGame(true)
        setGameState(data)
        navigate('/room')
    }

    return (
    <div
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) -40%, var(--clr-bg-primary) 30%), url(https://cdn.pixabay.com/photo/2016/11/06/23/51/buildings-1804481_640.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            boxSizing: 'border-box',
        }}
    >

        {/* Say Buenos Dias, tardes  o noche depending the time */}
        <h2>
            {(() => {
                const hour = new Date().getHours()
                if (hour >= 5 && hour < 12) return "Buenos días"
                if (hour >= 12 && hour < 19) return "Buenas tardes"
                return "Buenas noches"
            })()}
        </h2>
        <h1> {Auth.getName()} </h1>
        <ButtonMenu 
        onClick={onClickEnter} 
        disabled={isLoading} 
        icon={<IcnPlay />} 
        text="Entrar a la sala" />

        <ButtonMenu 
        className="danger" 
        onClick={onClickLogout} 
        disabled={isLoading}
        icon={<IcnOff />} 
        text="Cerrar sesión" />
        
    </div>
    )
}

{/* <ButtonMenu onClick={toggleFullScreen} icon={<IcnExpand />} 
text={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"} /> */}