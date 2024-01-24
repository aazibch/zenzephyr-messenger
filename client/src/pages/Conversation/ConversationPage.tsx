import {
  json,
  Params,
  redirect,
  useParams,
  useRouteLoaderData
} from 'react-router-dom';
import ConversationContainer from '../../components/Messenger/Conversation/ConversationContainer';
import { apiUrl } from '../../constants';
import { generateHttpConfig, sendHttpRequest } from '../../utils';
import socket from '../../services/socket';
import { useEffect } from 'react';
import { ConversationObj } from '../../types';
import MainContentContainer from '../../components/UI/MainContentContainer';

const ConversationPage = () => {
  const conversationsData = useRouteLoaderData(
    'messenger'
  ) as ConversationObj[];
  const params = useParams();

  const activeConversation = conversationsData.find(
    (elem) => elem._id === params.id
  );

  useEffect(() => {
    document.title = `${activeConversation?.otherUser.fullName} | ZephyrMessenger`;
  }, []);

  return (
    <MainContentContainer>
      <ConversationContainer />
    </MainContentContainer>
  );
};

export default ConversationPage;

export const loader = async ({ params }: { params: Params }) => {
  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/conversations/${params.id}/messages`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    return response.data;
  }

  throw json({ message: 'Page not found.' }, { status: 404 });
};

export const action = async ({
  params,
  request
}: {
  params: Params;
  request: Request;
}) => {
  if (request.method === 'DELETE') {
    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/conversations/${params.id}`,
      method: 'DELETE',
      allowCredentials: true
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
      return redirect('/messenger');
    }

    throw json(response.message, { status: response.status });
  }

  if (request.method === 'POST') {
    const formData = await request.formData();

    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/conversations/${params.id}/messages`,
      method: 'POST',
      allowCredentials: true,
      body: formData
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
      socket.emit('sendMessage', response.data!.message);
      return response;
    }

    throw json(response.message, { status: response.status });
  }

  if (request.method === 'PATCH') {
    const data = await request.json();

    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/users/${data.id}/${data.action}`,
      method: 'PATCH',
      allowCredentials: true
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
      const { data } = response;

      if (data) {
        socket.emit(
          'blockOrUnblock',
          data.authenticatedUser._id,
          data.otherUser._id,
          data.authenticatedUser.connections,
          data.otherUser.connections
        );
      }

      return response.data;
    }

    throw json(response.message, { status: response.status });
  }
};
