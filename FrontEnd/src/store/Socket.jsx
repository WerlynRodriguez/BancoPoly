import { io } from "socket.io-client"

/** Socket connection 
 * @type {SocketIOClient.Socket} */
const socket = io('192.168.1.14:5000')
// const socket = io('172.23.82.105:5000')

export default socket