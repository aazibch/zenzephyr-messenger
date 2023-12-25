import http = require('http');
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import socketController from './controllers/socketController';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './types';

dotenv.config();

const server = http.createServer(app);

const io = new Server<ServerToClientEvents>(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

io.on('connection', socketController.onConnection(io));

mongoose
  .connect(process.env.MONGO_CON_STRING)
  .then(() => console.log('Connected to database.'))
  .catch(() => console.log('Unable to connect to the database.'));
