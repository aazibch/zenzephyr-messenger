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
  databaseId?: string;
  socketId?: string;
  activeConversation?: string | null;
  connections?: ObjectId[] | string[];
}

const updateUser = (data: UpdateUserArguments) => {
  const index = onlineUsers.findIndex(
    (elem) => elem.databaseId === data.databaseId
  );

  const { databaseId, socketId, activeConversation, connections } = data;

  if (onlineUsers[index] && databaseId) {
    onlineUsers[index]['databaseId'] = databaseId;
  }

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

const getUser = (databaseId: string) => {
  return onlineUsers.find((user) => user.databaseId === databaseId);
};

const getOnlineConnections = (io: Server, connectionIds: ObjectId[]) => {
  const onlineConnections: SocketUserDataObj[] = [];

  console.log('[getOnlineConnections] connectionIds', connectionIds);

  connectionIds.forEach((connectionId) => {
    console.log('[getOnlineConnections] onlineUsers', onlineUsers);
    const connection = onlineUsers.find(
      (user) => user.databaseId === connectionId.toString()
    );
    if (connection) {
      onlineConnections.push(connection);
    }

    console.log('[getOnlineConnections] onlineConnections', onlineConnections);
  });

  return onlineConnections;
};

const onConnection = (io: Server) => {
  return (socket: Socket) => {
    let userDatabaseId: string;
    console.log('[Socket server] A user connected.');

    // socket.on(
    //   'saveUser',
    //   async (
    //     databseId: string,
    //     activeConversation: string,
    //     connections: string[]
    //   ) => {
    //     const user = getUser(databaseId);
    //     userDatabaseId = user._id.toString();

    //     if (user) {
    //       saveUser({
    //         databaseId,
    //         socketId: socket.id,
    //         activeConversation: null,
    //         connections: user.connections
    //       });
    //     }

    //     // console.log('user.connections', user.connections);

    //     const onlineConnections = getOnlineConnections(io, user.connections);
    //     // console.log(
    //     //   '["saveUser"] onlineConnections',
    //     //   databaseId,
    //     //   onlineConnections
    //     // );
    //     io.to(socket.id).emit('onlineUsers', onlineConnections);
    //     // io.emit('onlineUsers', onlineUsers);
    //     // console.log('["saveUser" event]', onlineUsers);
    //     // console.log('onlineUsers', onlineUsers);
    //   }
    // );

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
          updateUser({ socketId: socket.id, connections: userConnections });
        }

        if (recipient) {
          updateUser({
            databaseId: recipientDatabaseId,
            connections: recipientConnections
          });
          // io.to(recipient.socketId).emit(
          //   'blockedOrUnblockedConversation',
          //   conversationData.conversation
          // );
        }
        // console.log('onlineUsers', onlineUsers);
      }
    );

    socket.on('disconnect', () => {
      removeUser(socket.id);
      // io.emit('onlineUsers', onlineUsers);
      console.log('[Socket server] A user disconnected.');
      // console.log('["disconnect"]', onlineUsers);
    });
  };
};

const socketController = {
  onConnection
};

export default socketController;
