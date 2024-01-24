import { useRouteLoaderData } from 'react-router-dom';
import { AuthObj, SocketUserDataObj } from '../../types';
import { useContext, useEffect } from 'react';
import socket from '../../services/socket';
import MessengerContext from '../../store/messenger-context';

const SocketsWrapper = ({ children }: { children: React.ReactNode }) => {
  const auth = useRouteLoaderData('root') as AuthObj;
  const userId = auth?.authenticatedUser._id;
  const messengerCtx = useContext(MessengerContext);

  useEffect(() => {
    if (userId) {
      socket.connect();
    }

    return () => {
      if (userId) {
        socket.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (auth?.authenticatedUser) {
      socket.emit(
        'updateUser',
        auth.authenticatedUser._id,
        undefined,
        auth.authenticatedUser.connections
      );
    }
  }, [auth]);

  useEffect(() => {
    const onOnlineUsers = (updatedOnlineUsers: SocketUserDataObj[]) => {
      messengerCtx.updateOnlineUsers(updatedOnlineUsers);
    };

    socket.on('onlineUsers', onOnlineUsers);

    return () => {
      socket.off('onlineUsers', onOnlineUsers);
    };
  }, []);

  return children;
};

export default SocketsWrapper;
