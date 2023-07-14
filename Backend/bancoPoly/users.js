const propTypes = ["properties", "utilities", "railroads"]

export default class Player {
    /** In game entity that represents a player
     **/
    constructor () {
        /** @type {boolean} */
        this.inGame = true

        /** @type {number} */
        this.money = 1500

        /** @type {Array<int>} */
        this.properties = []

        /** @type {number[]} */
        this.utilities = []

        /** @type {number[]} */
        this.railroads = []
    }

    parseData() {
        return {
            money: this.money,
            properties: this.properties,
            utilities: this.utilities,
            railRoads: this.railroads,
        }
    }

    /** @returns {number} */
    searchProperty(type, id) {
        return this[propTypes[type]].indexOf(id)
    }

    /** Add a property to the player
     * @param {number} type - Type of the property
     * @param {number} id - Id of the property */
    addProperty(type, id) {
        this[propTypes[type]].push(id)
    }

    /** Remove a property from the player
     * @param {number} type - Type of the property
     * @param {number} id - Id of the property 
     * @param {number} index - Index of the property in the array
     **/
    removeProperty(type, id, index) {
        this[propTypes[type]].splice(index, 1)
    }
}

export class User {
    /** In Server entity that represents a person
     * @param {number} pin - Pin of the users
     */
    constructor(
        pin = 1234,
        lastToken
    ) {
        /** @type {number} */
        this.pin = pin;

        /** @type {boolean} */
        this.online = true;

        /** @type {boolean} */
        this.inGame = false;

        /** @type {string} */
        this.lastToken = lastToken;
    }

    /** Connect the user 
     * @param {string} newToken - New token for the user
     **/
    connect(newToken) { 
        this.online = true;
        this.lastToken = newToken; 
    }

    /** Disconnect the user */
    disconnect() { 
        this.online = false;
        this.inGame = false;
    }

    /** @returns {boolean} */
    isOnline() { return this.online; }

    /** @returns {boolean} */
    isInGame() { return this.inGame; }
}