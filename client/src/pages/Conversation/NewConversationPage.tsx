import { json, redirect, useLoaderData } from 'react-router-dom';
import { apiUrl } from '../../constants';
import { generateHttpConfig, sendHttpRequest } from '../../utils';
import ConversationHeader from '../../components/Messenger/Conversation/ConversationHeader';
import MessageInput from '../../components/Messenger/MessageInput/MessageInput';
import NewConversationContent from '../../components/Messenger/Conversation/NewConversationContent';
import { useEffect, useState } from 'react';
import { OptimisticMessageObj, UserObj } from '../../types';
import socket from '../../services/socket';

const NewConversationPage = () => {
  const newConversationUser = useLoaderData() as UserObj | undefined;
  const [optimisticMessage, setOptimisticMessage] =
    useState<OptimisticMessageObj>();

  useEffect(() => {
    if (newConversationUser) {
      document.title = `${newConversationUser.fullName} | ZephyrMessenger`;
    }
  }, []);

  const saveOptimisticMessage = (optimisticMessage: OptimisticMessageObj) => {
    setOptimisticMessage(optimisticMessage);
  };
  return (
    <div className="flex flex-col justify-between flex-grow">
      <ConversationHeader />
      <NewConversationContent optimisticMessage={optimisticMessage} />
      <MessageInput saveOptimisticMessage={saveOptimisticMessage} />
    </div>
  );
};

export default NewConversationPage;

export const loader = async ({ request }: { request: Request }) => {
  const parsedUrl = new URL(request.url);
  const searchParams = new URLSearchParams(parsedUrl.searchParams);
  const userId = searchParams.get('userId');

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/${userId}`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success' && response.data!.otherUser) {
    return response.data!.otherUser;
  }

  if (response.statusText === 'success' && !response.data!.authenticatedUser) {
    throw json('User not found.', { status: 404 });
  }

  throw json(response.message, { status: response.status });
};

export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    const parsedUrl = new URL(request.url);
    const searchParams = new URLSearchParams(parsedUrl.searchParams);
    const userId = searchParams.get('userId') as string;
    const formData = await request.formData();

    formData.append('recipient', userId);

    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/conversations/`,
      method: 'POST',
      allowCredentials: true,
      body: formData
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
      socket.emit('sendMessage', response.data!.message);
      return redirect(`/messenger/${response.data!.conversation._id}`);
    }

    throw json(response.message, { status: response.status });
  }
};
