import Player, { User } from "./users.js"

const minUsers = 2
const maxUsers = 8

export const bankStatus = Object.freeze({
    waiting: 0, // Ready to start (Looking for players)
    playing: 1, // Playing
})

const errorsTypes = Object.freeze({
    enterGame: {
        maxPlayers: 0,
        notWaitingYou: 1,
        inGame: 2,
        alreadyInGame: 3,
    },
    payMoney: {
        notEnoughMoney: 0,
        notExistEntity: 1,
    }
})

const propertiesTypes = ["properties", "utilities", "railroads"]

/** This function exclude a namePlsyer from all players
 * @param {Object} players - All players in the game
 * @param {string} name - Name of the player to exclude
 * @returns {Object} - Object without the key
 * @example
 * const obj = {a: 1, b: 2, c: 3}
 * exclude(obj, 'b') // {a: 1, c: 3}
 * exclude(obj, 'a') // {b: 2, c: 3}
 **/
function exclude(players, nameExclude) {
    let result = {};
    for (let names in players) 
      if (names !== nameExclude)
        result[names] = { inGame: players[names].inGame }
    
    return result
}

export default class Bank {
    constructor() {
        /** Status of the bank
         * @type {number} */
        this.status = bankStatus.waiting
        /** All ids of the properties
         * @type {number[]} */
        this.properties = Array.from({ length: 22 }, (_, i) => i)

        /** All ids of the utilities
         * @type {number[]} */
        this.utilities = [0, 1]

        /** All ids of the railroads 
         * @type {number[]} */
        this.railroads = [0, 1, 2, 3]

        /** All players in the game
         * @type {Object.<string, Player>} */
        this.players = {}

        /** Inactive players
         * @type {string} */
        this.countInactive = 0

        /** @type {string} */
        this.owner = ""

        /** The timer reset game after 2 minutes of no players
         * @type {NodeJS.Timeout | undefined} */
        this.timerReset = undefined
    }

    reset() {
        this.status = bankStatus.waiting
        this.properties = Array.from({ length: 22 }, (_, i) => i)
        this.utilities = [0, 1]
        this.railroads = [0, 1, 2, 3]
        this.players = {}
        this.countInactive = 0
        this.owner = ""
        if (this.timerReset !== undefined) clearTimeout(this.timerReset)
    }

    /** Converts all the data of the game to send to the player
     * @param {string} name
     **/
    parseGameDataForPlayer(name) {
        const ownPData = this.players[name].parseData()
        return {
            ...ownPData,
            players: exclude(this.players, name),
            waitingForPlayers: this.waitingForPlayers,
            notif: [],
            isMeBank: this.owner === name,
            gameStatus: this.status
        }
    }

    /** Select a new Owner
     * @returns {string} - The new owner
     **/
    selectNewOwner() {
        for (const name in this.players) {
            if (this.players[name].inGame) {
                console.log(`The new owner is ${name}`)
                this.owner = name
                return name
            }
        }
        return ""
    }


    /** A user left the game
     * @param {string} name - Name of the user
     * @param {Map<string, User>} users - All users in the game
     * @param {SocketIO.Socket} socket - Socket of the user
     * @param {SocketIO.Server} io - Socket of the server
     **/
    leavePlayer(name, users, socket, io) {
        const user = users.get(name)
        user.inGame = false
        const playersLength = Object.keys(this.players).length
        this.countInactive++

        if (this.players[name] !== undefined)
            this.players[name].inGame = false
        console.log(`User ${name} left the game`)


        // ====================================================
        // THIS IS ONLY IN WAITING MODE
        // ====================================================
        if (this.status === bankStatus.waiting) {

            if (playersLength - 1 <= 0) {
                console.log(`No players in the game, reseting`)
                this.reset()
                return
            }

            if (this.players[name] !== undefined)
                delete this.players[name]
            if (this.owner === name) this.selectNewOwner()

            socket.leave('game')
            io.to('game').emit('updatePlayers', { type: 'delete', name, newOwner: this.owner })
            return
        }

        // ====================================================
        // THIS IS ONLY IN PLAYING MODE
        // ====================================================

        if (this.countInactive >= playersLength) {
            // Set the timer to reset the game in 2 minutes
            this.owner = ""
            console.log(`No players in the game, reseting in 2 minutes`)
            this.timerReset = setTimeout(() => {
                console.log(`Reseting the game by inactivity`)
                this.reset()
            }, 120000)
            return
        }

        // If the owner left the game, search an active player to be the new owner
        if (this.owner === name) this.selectNewOwner()

        socket.leave('game')
        io.to('game').emit('updatePlayers', { type: 'leave', name, newOwner: this.owner })
    }


    /** Set all the events for the bank
     * @param {SocketIO.Server} io
     * @param {SocketIO.Socket} socket
     * @param {function(): string} nameUser
     * @param {Map<string, User>} users
     **/
    setAllEvents( 
        io, 
        socket,
        nameUser,
        users
    ) {
        socket.on('requestEnterGame', (callback) => {
            // Check if the game is playing
            if (this.status === bankStatus.playing){
                if (this.players[nameUser()] === undefined) {
                    callback({error: errorsTypes.enterGame.inGame})
                    return
                }

                if (this.timerReset !== undefined) {
                    clearTimeout(this.timerReset)
                    this.timerReset = undefined
                    console.log(`Auto reset canceled`)
                }

                if (this.owner === "") this.owner = nameUser()

                console.log(`User ${nameUser()} reEntered the game`)
                socket.join('game')
                this.countInactive--
                this.players[nameUser()].inGame = true
                users.get(nameUser()).inGame = true
                callback(this.parseGameDataForPlayer(nameUser()))
                socket.to('game').emit('updatePlayers', { type: 'reEnter', name: nameUser() })
            }

            // ====================================================
            // THIS IS ONLY IN READY MODE
            // ====================================================

            // This is the previous status of length
            const pyrLength = Object.keys(this.players).length
            if (pyrLength >= maxUsers) {
                callback({error: errorsTypes.enterGame.maxPlayers})
                return
            }

            if (this.players[nameUser()] !== undefined) {
                callback({error: errorsTypes.enterGame.alreadyInGame})
                return
            }
            
            if ( pyrLength == 0 ) this.owner = nameUser()

            console.log(`User ${nameUser()} entered the game`)
            socket.join('game')
            this.players[nameUser()] = new Player()
            users.get(nameUser()).inGame = true
            callback(this.parseGameDataForPlayer(nameUser()))
            socket.to('game').emit('updatePlayers', { type: 'add', name: nameUser() })
        })

        socket.on('payMoney', (data, callback) => {
            /** @type {{entity: string | number, amount: number, callback: function()}} */
            const { amount, asABank } = data
            let { entity } = data

            if (!asABank){
                // Check if the user have this money
                if (this.players[nameUser()].money < amount) {
                    callback({ error: errorsTypes.payMoney.notEnoughMoney })
                    return
                }

                // Check if the entity is a player
                if (entity !== -1 && this.players[entity] === undefined) {
                    callback({ error: errorsTypes.payMoney.notExistEntity })
                    return
                }

                this.players[nameUser()].money -= amount
                console.log(`User ${nameUser()} paid ${amount} 
                to ${entity === -1 ? 'the bank' : entity}`) 

                // Check if the entity is the bank
                if (entity === -1) {
                    callback({})
                    return
                }

                this.players[entity].money += amount
                callback({})

            } else {
                if (entity == -1){
                    entity = nameUser()
                    this.players[entity].money += amount

                    socket.emit('incomeMoney', {
                        amount: amount,
                        entity: "Banco"
                    })
                }
                this.players[entity].money += amount
                callback({isBank: true})
                console.log(`Bank paid ${amount} to ${entity}`)
            }

            if (this.players[entity].inGame)
                socket.to(users.get(entity).lastToken)
                .emit('incomeMoney', { 
                    amount: amount,
                    entity: asABank ? "Banco" : nameUser()
                })
        })

        socket.on('sendProperty', (data, callback) => {
            const { id, type, entity, asABank } = data

            if (asABank){
                const index = this[propertiesTypes[type]].indexOf(id)

                if (index === -1) {
                    callback({ error: "No la posee el Banco" })
                    return
                }

                // Remove the property from the bank
                this[propertiesTypes[type]].splice(index, 1)
                // Add the property to the player
                if (entity !== "-1") {
                    this.players[entity].addProperty(type, id)
                    socket.to(users.get(entity).lastToken).emit('incomeProperty', {
                        type: type,
                        id: id,
                        entity: "Banco"
                    })
                    console.log(`Bank sent ${id} to ${entity}`)
                } else {
                    this.players[nameUser()].addProperty(type, id)
                    socket.emit('incomeProperty', {
                        type: type,
                        id: id,
                        entity: "Banco"
                    })
                    console.log(`Bank sent ${id} to ${nameUser()}`)
                }

                callback({isBank: true})

            } else {
                // Check if the user have this property
                const index = this.players[nameUser()].searchProperty(type, id)
                if (index === -1) {
                    callback({ error: "No posees esta propiedad" })
                    return
                }

                // Remove the property from the player
                this.players[nameUser()].removeProperty(type, id, index)
                // Add the property to the player
                if (entity !== "-1") {
                    this.players[entity].addProperty(type, id)
                    socket.to(users.get(entity).lastToken).emit('incomeProperty', {
                        type: type,
                        id: id,
                        entity: nameUser()
                    })
                    console.log(`User ${nameUser()} sent ${id} to ${entity}`)
                }
                else {
                    this[propertiesTypes[type]].push(id)
                    console.log(`User ${nameUser()} sent ${id} to the bank`)
                }

                callback({entity: entity === "-1" ? "Banco" : entity})
            }
        })

        socket.on('startGame', () => {
            if (this.status !== bankStatus.waiting) return
            if (Object.keys(this.players).length < minUsers) return

            this.status = bankStatus.playing
            io.to('game').emit('startGame')
        })

        socket.on('banned', (namePlayer) => {
            if (this.players[namePlayer] === undefined) return

            console.log(`User ${namePlayer} banned`)

            if (this.players[namePlayer].inGame){
                console.log(`User ${namePlayer} is in the game, sending banned`)
                socket.to(users.get(namePlayer).lastToken).emit('banned')
            }

            const bannedPlayer = this.players[namePlayer]
            bannedPlayer.inGame = false
            users.get(namePlayer).inGame = false

            // return all properties, utilities and railroads to the bank
            for (const id of bannedPlayer.properties) this.properties.push(id)
            for (const id of bannedPlayer.utilities) this.utilities.push(id)
            for (const id of bannedPlayer.railroads) this.railroads.push(id)

            delete this.players[namePlayer]
            io.to('game').emit('updatePlayers', { type: 'delete', name: namePlayer, newOwner: this.owner })
        })

        socket.on('leaveGame', () => { this.leavePlayer(nameUser(), users, socket, io)})
    }
}