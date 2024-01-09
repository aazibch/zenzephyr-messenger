import { Server, Socket } from 'socket.io';
import { MessageObj, SocketUserDataObj } from '../types';

const onlineUsers: SocketUserDataObj[] = [];

const saveUser = (data: SocketUserDataObj) => {
  if (!onlineUsers.some((user) => user.databaseId === data.databaseId)) {
    onlineUsers.push(data);
  } else {
    const index = onlineUsers.findIndex(
      (elem) => elem.databaseId === data.databaseId
    );
    onlineUsers[index].socketId = data.socketId;
  }
};

const removeUser = (socketId: string) => {
  const index = onlineUsers.findIndex((user) => user.socketId === socketId);

  if (index > -1) {
    onlineUsers.splice(index, 1);
  }
};

const getUser = (databaseId: string) => {
  return onlineUsers.find((user) => user.databaseId === databaseId);
};

const updateActiveConversation = ({
  databaseId,
  socketId,
  activeConversation
}: SocketUserDataObj) => {
  const userPresent = onlineUsers.some(
    (user) => user.databaseId === databaseId
  );

  if (!userPresent) {
    onlineUsers.push({ databaseId, socketId, activeConversation });
  } else {
    const index = onlineUsers.findIndex(
      (user) => user.databaseId === databaseId
    );

    if (index > -1) {
      onlineUsers[index].activeConversation = activeConversation;
    }
  }
};

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    socket.on('saveUser', (databaseId: string) => {
      saveUser({ databaseId, socketId: socket.id, activeConversation: null });
      io.emit('onlineUsers', onlineUsers);
      console.log('[Socket server] A user connected.', onlineUsers);
    });

    socket.on(
      'updateActiveConversation',
      ({
        databaseId,
        conversationId
      }: {
        databaseId: string;
        conversationId: string | null;
      }) => {
        updateActiveConversation({
          databaseId,
          socketId: socket.id,
          activeConversation: conversationId
        });
        io.emit('onlineUsers', onlineUsers);
      }
    );

    socket.on('sendMessage', (message: MessageObj) => {
      const recipient = getUser(message.recipient);

      if (recipient && recipient.activeConversation === message.conversation) {
        io.to(recipient.socketId).emit('chatMessage', message);
      }
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit('onlineUsers', onlineUsers);
      console.log('[Socket server] A user disconnected.');
      console.log('[Socket server] A user connected.', onlineUsers);
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
