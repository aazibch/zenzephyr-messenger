import { Server, Socket } from 'socket.io';
import { IConversation, IUser, MessageObj, SocketUserDataObj } from '../types';
import User from '../models/UserModel';
import { ObjectId } from 'mongoose';

const onlineUsers: SocketUserDataObj[] = [];

interface BlockedUnblockedConversation {
  conversation: IConversation;
  recipientId: string;
}

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

interface UpdateUserArguments {
  socketId?: string;
  activeConversation?: string | null;
  connections?: string[];
}

const updateUser = (databaseId: string, data: UpdateUserArguments) => {
  const index = onlineUsers.findIndex((elem) => elem.databaseId === databaseId);

  const { socketId, activeConversation, connections } = data;

  if (onlineUsers[index] && socketId) {
    onlineUsers[index]['socketId'] = socketId;
  }

  if (onlineUsers[index] && activeConversation) {
    onlineUsers[index]['activeConversation'] = activeConversation;
  }

  if (onlineUsers[index] && connections) {
    onlineUsers[index]['connections'] = connections;
  }
};

const removeUser = (socketId: string) => {
  const index = onlineUsers.findIndex((user) => user.socketId === socketId);

  if (index > -1) {
    onlineUsers.splice(index, 1);
  }
};

const getUser = (id: string) => {
  return onlineUsers.find(
    (user) => user.databaseId === id || user.socketId === id
  );
};

const getOnlineConnections = (connections: string[]) => {
  const onlineConnections: SocketUserDataObj[] = [];

  connections.forEach((connectionId) => {
    const connection = onlineUsers.find(
      (user) => user.databaseId === connectionId.toString()
    );
    if (connection) {
      onlineConnections.push(connection);
    }
  });

  return onlineConnections;
};

// const sendOnlineConnectionsToUser = (io: Server, databaseId: string) => {
//   const user = getUser(databaseId);
//   const onlineConnections: SocketUserDataObj[] = getOnlineConnections(
//     user.connections
//   );
//   io.to(user.socketId).emit('onlineUsers', onlineConnections);
// };

const sendOnlineConnectionsToConnections = (
  onlineConnections: SocketUserDataObj[],
  io: Server
) => {
  onlineConnections.forEach((connection) => {
    const user = getUser(connection.databaseId);

    if (user) {
      const onlineConnections = getOnlineConnections(user.connections);

      io.to(user.socketId).emit('onlineUsers', onlineConnections);
    }
  });
};

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    let userDatabaseId: string;
    console.log('[Socket server] A user connected.');

    socket.on(
      'updateUser',
      async (
        databaseId: string,
        activeConversation: string,
        connections: string[]
      ) => {
        const user = getUser(databaseId);

        if (!user) {
          saveUser({
            databaseId,
            socketId: socket.id,
            activeConversation: activeConversation,
            connections: connections
          });
        } else {
          updateUser(databaseId, {
            socketId: socket.id,
            activeConversation: activeConversation,
            connections: connections
          });
        }

        const onlineConnections = getOnlineConnections(connections);
        io.to(socket.id).emit('onlineUsers', onlineConnections);
        sendOnlineConnectionsToConnections(onlineConnections, io);
      }
    );

    // socket.on(
    //   'typing',
    //   (data: {
    //     sender: string;
    //     recipient: string;
    //     conversation: string;
    //     isTyping: boolean;
    //   }) => {
    //     const recipient = getUser(data.recipient);

    //     if (recipient && recipient.activeConversation === data.conversation) {
    //       io.to(recipient.socketId).emit('typingStatus', data.isTyping);
    //     }
    //   }
    // );

    // socket.on('updateUser', (data: IUser) => {
    //   console.log('["updateUser"]', data);
    // });

    // socket.on(
    //   'updateActiveConversation',
    //   async ({
    //     databaseId,
    //     conversationId
    //   }: {
    //     databaseId: string;
    //     conversationId: string | null;
    //   }) => {
    //     const user = getUser(databaseId);
    //     let userDoc;

    //     if (user) {
    //       updateUser({
    //         socketId: socket.id,
    //         activeConversation: conversationId
    //       });
    //     } else {
    //       userDoc = await User.findById(databaseId);

    //       if (userDoc) {
    //         saveUser({
    //           databaseId,
    //           socketId: socket.id,
    //           activeConversation: conversationId,
    //           connections: userDoc.connections
    //         });
    //       }
    //     }

    //     if (!userDatabaseId && userDoc) {
    //       userDatabaseId = userDoc._id.toString();
    //     }

    //     const onlineConnections = getOnlineConnections(
    //       io,
    //       user?.connections || userDoc?.connections
    //     );
    //     io.to(socket.id).emit('onlineUsers', onlineConnections);
    //     console.log(
    //       '["updateActiveConversation"] onlineConnections',
    //       databaseId,
    //       onlineConnections
    //     );
    //     console.log('onlineUsers', onlineUsers);
    //   }
    // );

    socket.on('sendMessage', (message: MessageObj) => {
      const recipient = getUser(message.recipient);

      if (recipient) {
        io.to(recipient.socketId).emit('chatMessage', message);
      }
    });

    socket.on(
      'blockOrUnblock',
      async (
        userDatabaseId: string,
        recipientDatabaseId: string,
        userConnections: string[],
        recipientConnections: string[]
      ) => {
        const recipient = getUser(recipientDatabaseId);
        const user = getUser(userDatabaseId);

        if (user) {
          updateUser(user.databaseId, {
            socketId: socket.id,
            connections: userConnections
          });
        }

        if (recipient) {
          updateUser(recipientDatabaseId, {
            connections: recipientConnections
          });
          // io.to(recipient.socketId).emit(
          //   'blockedOrUnblockedConversation',
          //   conversationData.conversation
          // );
        }
        console.log('["blockOrUnblock"] onlineUsers', onlineUsers);
      }
    );

    socket.on('disconnect', () => {
      const userRef = getUser(socket.id);

      if (userRef) {
        const user = { ...userRef, connections: [...userRef.connections] };
        removeUser(socket.id);
        const onlineConnections = getOnlineConnections(user.connections);
        sendOnlineConnectionsToConnections(onlineConnections, io);
      }

      console.log('[Socket server] A user disconnected.');
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
