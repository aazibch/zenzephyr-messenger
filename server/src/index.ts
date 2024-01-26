import http = require('http');
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import socketController from './controllers/socketController';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types';
import { clientUrl } from './constants';

dotenv.config();

const server = http.createServer(app);

const io = new Server<ServerToClientEvents, ClientToServerEvents>(server, {
  cors: {
    origin: clientUrl,
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
  .catch((err) => console.log('Unable to connect to the database.', err));
