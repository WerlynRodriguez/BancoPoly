// Author: Werlyn Rodriguez (WerlynDev)

import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer} from 'socket.io'
import http from 'http'
import cors from 'cors'

import { IP, Puerto } from './config.js'
import BancoPoly from './bancoPoly/bancoPoly.js'

const app = express()

// Create a server with express app and all configurations for socket.io
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
    }
})

app.use(morgan('dev'))
app.use(cors())

try {
    BancoPoly(io)
} catch (error) { 
    console.log(error)
}

server.listen(Puerto, IP, () => { console.log('App listening on ' + IP + ':' + Puerto); });