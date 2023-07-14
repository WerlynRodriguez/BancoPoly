import { create } from 'zustand'

export const useGameStore = create((set) => ({
    /** @type {boolean} */
    isInGame: false,
    /** @param {boolean} inGame */
    setInGame: (inGame) => set((state) => ({ isInGame: inGame })),
    /** @type {{money: number, properties: number[], railRoads: number[], utilities: number[], players: {[key: string]: {inGame: boolean}}, waitingForPlayers: string[], notif: string[], isMeBank: boolean, gameStatus: number, waitingList: string[]}} */
    GameState: {
        money: 1500,
        properties: [],
        railRoads: [],
        utilities: [],
        players: {},
        waitingForPlayers: [],
        notif: [],
        isMeBank: false,
        gameStatus: 0,
        waitingList: []
    },
    /** @param {{money: number, properties: number[], railRoads: number[], utilities: number[], players: {[key: string]: any}, notif: string[], isMeBank: boolean, isMeBroke: boolean, gameStatus: number}} gameState */
    setGameState: (gameState) => set((state) => ({ GameState: gameState })),
    /** Update any of GameState properties
     * @param {string} key - The key of the property to update
     * @param {any} value - The value to update */
    updateGameState: (key, value) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                [key]: value
            }
        })),
    /** Add money to the GameState
     * @param {number} amount */
    addMoney: (amount) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                money: state.GameState.money + amount
            }
        })),
    /** Remove money to the GameState
     * @param {number} amount */
    removeMoney: (amount) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                money: state.GameState.money - amount
            }
        })),
    /** Add a property (properties, railRoads or utilities) of the GameState
     * @param {string} key - The key of the property to update
     * @param {number} idProperty */
    addProperty: (key, idProperty) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                [key]: [...state.GameState[key], idProperty]
            }
        })),
    /** Delete a property (properties, railRoads or utilities) of the GameState
     * @param {string} key - The key of the property to update
     * @param {number} idProperty */
    deleteProperty: (key, idProperty) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                [key]: state.GameState[key].filter((id) => id !== idProperty)
            }
        })),
    /** Add a new Player to the GameState
     * @param {string} namePlayer */
    addPlayer: (namePlayer) => 
        set((state) => ({
            GameState: {
                ...state.GameState,
                players: {
                    ...state.GameState.players,
                    [namePlayer]: { inGame: true }
                }
            }
        })),
    /** Delete a Player to the GameState
     * @param {string} namePlayer */
    deletePlayer: (namePlayer) =>
        set((state) => {
            const players = state.GameState.players
            delete players[namePlayer]
            return {
                GameState: {
                    ...state.GameState,
                    players
                }
            }
        }),
    /** Update a Player inGame property
     * @param {string} namePlayer
     * @param {boolean} inGame */
    updatePlayerInGame: (namePlayer, inGame) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                players: {
                    ...state.GameState.players,
                    [namePlayer]: { inGame: inGame }
                }
            }
        })),
    /** Add a notification to the state
     * @param {number} type - The type of the notification
     * @param {number} amount - The amount of the notification
     * @param {string} entity - The entity of the notification
     * @param {string} time - The time of the notification
     **/
    addNotif: (type, amount, entity, time) =>
        set((state) => ({
            GameState: {
                ...state.GameState,
                notif: [{ type, amount, entity, time }, ...state.GameState.notif]
            }
        })),
}))