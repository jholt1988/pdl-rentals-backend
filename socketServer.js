// src/server/socketServer.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.set('io', io);

export default server;
