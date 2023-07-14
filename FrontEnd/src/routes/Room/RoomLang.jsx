export const errorPayMoney = [
    "No tienes suficiente dinero",
    "La persona o entidad no existe",
]

export const bankStatus = Object.freeze({
    waiting: 0, // Ready to start (Looking for players)
    playing: 1, // Playing
    waitingMissingPlayers: 2 // Someone left the game, and we are waiting for this player
})