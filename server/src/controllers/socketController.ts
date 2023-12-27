import { Server, Socket } from 'socket.io';
import { MessageObj, SocketUserDataObj } from '../types';

let onlineUsers: SocketUserDataObj[] = [];

const getUser = (userId: string) => {
  return onlineUsers.find((user) => user.userId === userId);
};

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
      console.log(
        '[Socket server] (After connecting) onlineUsers',
        onlineUsers
      );
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('sendMessage', (messageData: MessageObj) => {
      console.log('[Socket server]["sendMessage" Listener]');
      const recipient = getUser(messageData.recipient);

      console.log(
        '[Socket server]["sendMessage" Listener] recipient',
        recipient
      );

      io.to(recipient.socketId).emit('chatMessage', {
        content: 'Hello person'
      });
    });

    socket.on('disconnect', () => {
      console.log('[Socket server] A user disconnected.');
      removeUser(socket.id);
      console.log(
        '[Socket server] (After disconnecting) onlineUsers',
        onlineUsers
      );
      io.emit('onlineUsers', onlineUsers);
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
