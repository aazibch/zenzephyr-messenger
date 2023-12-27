import { Outlet, json, redirect, useRouteLoaderData } from 'react-router-dom';
import MessengerSidebar from '../components/Messenger/MessengerSidebar/MessengerSidebar';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { protect } from '../utils/auth';
import { useEffect } from 'react';
import { AuthObj } from '../types';
import { socket } from '../services/socket';

const MessengerPage = () => {
  const auth = useRouteLoaderData('root') as AuthObj;

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit('saveUser', auth.user._id);
  }, [auth.user._id]);

  return (
    <div className="flex h-full overflow-hidden">
      <MessengerSidebar />
      <Outlet />
    </div>
  );
};

export default MessengerPage;

export const loader = async () => {
  const notFoundError = protect();

  if (notFoundError) throw notFoundError;

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/conversations`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    return response.data!.conversations;
  }

  throw json(response.message, { status: response.status });
};

export const action = async ({ request }: { request: Request }) => {
  const data = await request.json();

  if (data.username) {
    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/users/${data.username}`,
      method: 'GET',
      allowCredentials: true
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
      return response.data!.user;
    }

    throw json(response.message, { status: response.status });
  }

  if (data.userId) {
    redirect(`/messenger/new?userId=${data.userId}`);
  }
};
