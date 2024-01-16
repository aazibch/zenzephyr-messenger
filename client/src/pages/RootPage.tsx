import { Outlet, redirect } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import { getTokenDuration } from '../utils/auth';
import AutoLogoutWrapper from '../components/Auth/AutoLogoutWrapper';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl, clientUrl } from '../constants';
import { clearAuthState } from '../utils/auth';
// import { AuthObj, SocketUserDataObj } from '../types';
// import { useContext, useEffect } from 'react';
// import socket from '../services/socket';
// import MessengerContext from '../store/messenger-context';
import SocketsWrapper from '../components/WebSockets/SocketsWrapper';

const RootPage = () => {
  // const auth = useLoaderData() as AuthObj | undefined;
  // const messengerCtx = useContext(MessengerContext);
  // const userId = auth?.user._id;

  // useEffect(() => {
  //   if (userId) {
  //     socket.connect();
  //   }

  //   return () => {
  //     if (userId) {
  //       socket.disconnect();
  //     }
  //   };
  // }, [userId]);

  // // useEffect(() => {
  // //   if (userId) {
  // //     socket.emit('updateUser', userId);
  // //   }
  // // }, [userId]);

  // useEffect(() => {
  //   if (auth?.user) {
  //     socket.emit(
  //       'updateUser',
  //       auth.user._id,
  //       undefined,
  //       auth.user.connections
  //     );
  //   }
  // }, [auth]);

  // useEffect(() => {
  //   const onOnlineUsers = (updatedOnlineUsers: SocketUserDataObj[]) => {
  //     messengerCtx.updateOnlineUsers(updatedOnlineUsers);
  //   };

  //   socket.on('onlineUsers', onOnlineUsers);

  //   return () => {
  //     socket.off('onlineUsers', onOnlineUsers);
  //   };
  // }, []);

  return (
    <SocketsWrapper>
      <AutoLogoutWrapper>
        <Layout>
          <Outlet />
        </Layout>
      </AutoLogoutWrapper>
    </SocketsWrapper>
  );
};

export default RootPage;

export const loader = async ({ request }: { request: Request }) => {
  const tokenDuration = getTokenDuration();
  const isAuth = localStorage.getItem('isAuth');

  if (isAuth && tokenDuration < 0) {
    clearAuthState();
    return { status: 'EXPIRED' };
  }

  if (!isAuth) {
    return null;
  }

  if (isAuth && request.url === clientUrl) {
    return redirect('/messenger');
  }

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/me`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    return {
      status: 'AUTHENTICATED',
      tokenDuration,
      user: response.data?.user
    };
  }

  return null;
};
