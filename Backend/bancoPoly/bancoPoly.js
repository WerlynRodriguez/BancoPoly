import { Server as SocketServer} from 'socket.io'
import Bank, { bankStatus } from "./bank.js"
import { User } from "./users.js"

/** @type {Map<string, User>} */
const users = new Map()

const bank = new Bank()

const errorsTypes = Object.freeze({
    login: {
        online: 0, // The user is already online
        pinWrong: 1, // The pin is wrong
        noData: 2, // No name or no pin send
        nonIdentified: 3, // The user is not identified
    },
})

/** Execute this file to set all the socket events for the game
 * @param {SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 * @returns {void}
 */
export default function BancoPoly( io ) {
    
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`)
        socket.nameUser = undefined

        /** @returns {string | undefined} */
        const nameUser = () => socket.nameUser

        /** @param {string} name */
        const setNameUser = (name) => socket.nameUser = name


        //----------------------------------------------------------------------
        // Ping the user
        socket.on('Ping', (callback) => { callback() })
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        // Reconnect - ReAuth
        socket.on('ReAuth', (data) => {
            const { name, lastToken } = data

            if (typeof name !== 'string' || typeof lastToken !== 'string') {
                socket.emit('ReAuth', {error: errorsTypes.login.nonIdentified})
                return
            }

            const maybeUser = users.get(name)
            if (maybeUser === undefined) {
                socket.emit('ReAuth', {error: errorsTypes.login.nonIdentified})
                return
            }

            if (maybeUser.lastToken !== lastToken) {
                socket.emit('ReAuth', {error: errorsTypes.login.nonIdentified})
                return
            }

            maybeUser.connect(socket.id)
            setNameUser(name)

            console.log(`ReAuth: ${name}`)
            socket.emit('ReAuth', {name: name, lastToken: socket.id})
        })


        // Check if the name is taken or 
        // if the pin is wrong or if the 
        // user is already online
        socket.on('Login', ( data ) => {
            /** @type {{name: string, pin: string}} */
            const { name, pin } = data

            if (typeof name !== 'string' || typeof pin !== 'string') {
                socket.emit('Login', {error: errorsTypes.login.noData})
                return
            }

            const maybeUser = users.get(name)
            if (maybeUser !== undefined) {
                if (maybeUser.isOnline()){
                    socket.emit('Login', {error: errorsTypes.login.online})
                    return
                }
                
                if (maybeUser.pin !== pin){
                    socket.emit('Login', {error: errorsTypes.login.pinWrong})
                    return
                }

                maybeUser.connect(socket.id)
                setNameUser(name)
                console.log(`Login: ${name}`)
            } else {
                users.set(name, new User(pin, socket.id))
                setNameUser(name)
                console.log(`Registered: ${nameUser()}`)
            }

            socket.emit('Login', {name: name, lastToken: socket.id})
        })
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        // On Logout
        socket.on('Logout', (callback) => {
            const maybeUser = users.get(nameUser())
            if (maybeUser !== undefined) maybeUser.disconnect()
            setNameUser(undefined)
            callback()
        })

        //----------------------------------------------------------------------
        // Set all the events for the bank
        bank.setAllEvents(io, socket, nameUser, users)
        //----------------------------------------------------------------------

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id} name: ${nameUser()}`)
            const maybeUser = users.get(nameUser())
            if (maybeUser === undefined) return

            maybeUser.disconnect()
            bank.leavePlayer(nameUser(), users, socket, io)
        })
    })
}