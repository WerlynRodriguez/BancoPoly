import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConectionStore } from "../store/conection";
import { toast } from "sonner";
import { useGameStore } from "../store/game";
import "./Landing.css"

export function Landing() {
    const navigate = useNavigate()
    const Connected = useConectionStore(state => state.Connected)

    const isInGame = useGameStore(state => state.isInGame)
    const setInGame = useGameStore(state => state.setInGame)

    const onClicklogin = () => {
        if (Connected) {
            navigate('/login')
        } else {
            toast.error('No se pudo conectar al servidor')
        }
    }

    useEffect(() => { if (isInGame) setInGame(false) }, [])

    return (
    <React.Fragment>
    <header id="land-header">
        <h3> Bancopoly </h3>
    </header>
    <main className="resLayout" onClick={onClicklogin}>
        <section id="banner">
            <h1> Bancopoly </h1>
            <p> Haz click aquí para iniciar sesión </p>
        </section>
    </main>
    <footer id="land-footer">
        <p>
            Designed by <a 
                href="https://github.com/WerlynRodriguez" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                Werlyn Rodriguez
            </a> with <span role="img" aria-label="heart">❤️</span>
        </p>
    </footer>
    </React.Fragment>
    )
}