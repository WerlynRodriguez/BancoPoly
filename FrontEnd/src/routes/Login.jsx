import React, { useState, useEffect } from "react";
import { Toaster, toast } from 'sonner';
import Auth from "../store/auth";
import socket from "../store/Socket";

import { useConectionStore } from '../store/conection';
import { useNavigate } from "react-router-dom";

const errorsMessages = [
    'El usuario ya esta conectado',
    'El pin es incorrecto',
    'No se envio el nombre o el pin',
    'El usuario no esta identificado',
]

/** Login Page */
export function Login() {
    const navigate = useNavigate()
    const isLogged = useConectionStore(state => state.isLogged)
    const setLogged = useConectionStore(state => state.setLogged)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isLogged) navigate('/')

        const name = Auth.getName()
        const lastToken = Auth.getToken()

        if (name && lastToken) socket.emit('ReAuth', { name, lastToken })
        else setLoading(false)

        socket.on('ReAuth', onLogin)
        socket.on('Login', onLogin)

        return () => { 
            socket.off('ReAuth', onLogin) 
            socket.off('Login', onLogin)
        }
    }, [])


    /** This function is used to handle the Login event
     * @param {{error: number, name: string, lastToken: string}} props - The event data
     **/
    const onLogin = (props) => {
        const { error, name, lastToken } = props

        if (error !== undefined) {
            setLoading(false)
            console.log(errorsMessages[error])
            if (error !== 3)
                toast.error(errorsMessages[error])
            return
        }

        Auth.setToken(lastToken)
        Auth.setName(name)
        setLogged(true)
        navigate('/home')
    }

    /** This function is used to handle the submit event of the form
     * @param {Event} event - The event that triggered the function 
     **/
    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.target)

        const name = data.get('name').toString()
        const pin = data.get('pin').toString()

        socket.emit('Login', { name, pin })
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
        <Toaster richColors/>
        <form 
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                rowGap: '10px',
            }}
        >
            <label htmlFor="name"> Nombre: </label>
            <input
                required
                type="text"
                inputMode="text"
                name="name" 
                disabled={loading}
                maxLength={15}
                minLength={3}
                pattern="[a-zA-Z]+"
            />

            <label htmlFor="pin"> Pin: </label>
            <input 
                required
                type="password"
                inputMode="numeric"
                name="pin" 
                disabled={loading}
                maxLength={4}
                minLength={4}
                pattern="[0-9]+"
            />

            <input
                className="btn"
                type="submit" 
                value="Submit" 
                disabled={loading} 
            />
        </form>
    </div>
    )
}