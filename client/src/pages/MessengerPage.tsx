import { Outlet, json, redirect, useRevalidator } from 'react-router-dom';
import MessengerSidebar from '../components/Messenger/MessengerSidebar/MessengerSidebar';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { protect } from '../utils/auth';
import { useEffect } from 'react';
import socket from '../services/socket';

const MessengerPage = () => {
  const revalidator = useRevalidator();

  useEffect(() => {
    document.title = 'ZephyrMessenger - Connect with your favorite people';
  }, []);

  useEffect(() => {
    const onChatMessage = () => {
      console.log('new chat message');
      if (revalidator.state === 'idle') {
        revalidator.revalidate();
      }
    };

    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

  useEffect(() => {
    const onBlockedOrUnblocked = () => {
      if (revalidator.state === 'idle') {
        revalidator.revalidate();
      }
    };

    socket.on('blockedOrUnblocked', onBlockedOrUnblocked);

    return () => {
      socket.off('blockedOrUnblocked', onBlockedOrUnblocked);
    };
  }, []);

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
      return response.data;
    }

    throw json(response.message, { status: response.status });
  }

  if (data.userId) {
    redirect(`/messenger/new?userId=${data.userId}`);
  }
};
