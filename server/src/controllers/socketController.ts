import { Server, Socket } from 'socket.io';
import { SocketUserDataObj } from '../types';

let onlineUsers: SocketUserDataObj[] = [];

const saveUser = (data: SocketUserDataObj) => {
  if (!onlineUsers.some((user) => user.userId === data.userId)) {
    onlineUsers.push(data);
  } else {
    const index = onlineUsers.findIndex((elem) => elem.userId === data.userId);
    onlineUsers[index].socketId = data.socketId;
  }
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    console.log('[Socket server] A user connected.');

    socket.on('saveUser', (userId: string) => {
      saveUser({ userId, socketId: socket.id });
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('disconnect', () => {
      console.log('[Socket server] A user disconnected.');
      removeUser(socket.id);
      io.emit('onlineUsers', onlineUsers);
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
