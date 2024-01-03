import { Server, Socket } from 'socket.io';
import { MessageObj, SocketUserDataObj } from '../types';

let onlineUsers: SocketUserDataObj[] = [];
// let openConversations: string[] = [];

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

const updateActiveConversation = ({
  userId,
  socketId,
  activeConversation
}: SocketUserDataObj) => {
  console.log(
    '[updateActiveConversation] activeConversation',
    activeConversation
  );

  const userPresent = onlineUsers.some((user) => user.userId === userId);

  if (!userPresent) {
    onlineUsers.push({ userId, socketId, activeConversation });
  } else {
    onlineUsers = onlineUsers.map((user) => {
      if (user.userId === userId) {
        return { ...user, activeConversation };
      }

      return user;
    });
  }

  console.log('[updateActiveConversation] onlineUsers', onlineUsers);
};

// const removeOpenConversation = (conversationId: string) => {
//   openConversations = openConversations.filter((id) => id !== conversationId);
// };

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    console.log('[Socket server] A user connected.');

    socket.on('saveUser', (userId: string) => {
      saveUser({ userId, socketId: socket.id, activeConversation: null });
      console.log(
        '[Socket server] (After connecting) onlineUsers',
        onlineUsers
      );
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on(
      'updateActiveConversation',
      ({
        userId,
        conversationId
      }: {
        userId: string;
        conversationId: string | null;
      }) => {
        console.log(
          '[Socket server]["updateActiveConversation" Listener] conversationId',
          conversationId
        );
        updateActiveConversation({
          userId,
          socketId: socket.id,
          activeConversation: conversationId
        });
        // console.log(
        //   '[Socket server]["updateActiveConversation" Listener] (after updating) onlineUsers',
        //   onlineUsers
        // );
      }
    );

    socket.on('sendMessage', (messageData: MessageObj) => {
      console.log('[Socket server]["sendMessage" Listener]');
      const recipient = getUser(messageData.recipient);

      if (recipient) {
        io.to(recipient.socketId).emit('chatMessage', messageData);
      }
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
