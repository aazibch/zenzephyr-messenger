import { Server, Socket } from 'socket.io';
import { IConversation, MessageObj, SocketUserDataObj } from '../types';

const onlineUsers: SocketUserDataObj[] = [];

interface BlockedUnblockedConversation {
  conversation: IConversation;
  recipientId: string;
}

// const saveUser = (data: SocketUserDataObj) => {
//   if (!onlineUsers.some((user) => user.databaseId === data.databaseId)) {
//     onlineUsers.push(data);
//   } else {
//     const index = onlineUsers.findIndex(
//       (elem) => elem.databaseId === data.databaseId
//     );
//     onlineUsers[index].socketId = data.socketId;
//   }
// };

const updateUser = (data: SocketUserDataObj) => {
  if (!onlineUsers.some((user) => user.databaseId === data.databaseId)) {
    onlineUsers.push(data);
  } else {
    const index = onlineUsers.findIndex(
      (elem) => elem.databaseId === data.databaseId
    );
    onlineUsers[index] = data;
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

// const updateActiveConversation = ({
//   databaseId,
//   socketId,
//   activeConversation
// }: SocketUserDataObj) => {
//   const userPresent = onlineUsers.some(
//     (user) => user.databaseId === databaseId
//   );

//   if (!userPresent) {
//     onlineUsers.push({ databaseId, socketId, activeConversation });
//   } else {
//     const index = onlineUsers.findIndex(
//       (user) => user.databaseId === databaseId
//     );

//     if (index > -1) {
//       onlineUsers[index].activeConversation = activeConversation;
//     }
//   }
// };

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    console.log('[Socket server] A user connected.');

    socket.on('saveUser', (databaseId: string) => {
      updateUser({ databaseId, socketId: socket.id, activeConversation: null });
      io.emit('onlineUsers', onlineUsers);
      console.log('["saveUser" event]', onlineUsers);
    });

    socket.on(
      'typing',
      (data: {
        sender: string;
        recipient: string;
        conversation: string;
        isTyping: boolean;
      }) => {
        const recipient = getUser(data.recipient);

        if (recipient && recipient.activeConversation === data.conversation) {
          io.to(recipient.socketId).emit('typingStatus', data.isTyping);
        }
      }
    );

    socket.on(
      'updateActiveConversation',
      ({
        databaseId,
        conversationId
      }: {
        databaseId: string;
        conversationId: string | null;
      }) => {
        updateUser({
          databaseId,
          socketId: socket.id,
          activeConversation: conversationId
        });
        io.emit('onlineUsers', onlineUsers);
        console.log('["updateActiveConversation" event]', onlineUsers);
      }
    );

    socket.on('sendMessage', (message: MessageObj) => {
      const recipient = getUser(message.recipient);

      if (recipient) {
        io.to(recipient.socketId).emit('chatMessage', message);
      }
    });

    socket.on(
      'blockOrUnblock',
      (conversationData: BlockedUnblockedConversation) => {
        const recipient = getUser(conversationData.recipientId);

        console.log('conversationData', conversationData);

        console.log('blockOrUnblock', recipient);

        if (recipient) {
          io.to(recipient.socketId).emit(
            'blockedOrUnblockedConversation',
            conversationData.conversation
          );
        }
      }
    );

    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit('onlineUsers', onlineUsers);
      console.log('[Socket server] A user disconnected.');
      console.log('["disconnect"]', onlineUsers);
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
