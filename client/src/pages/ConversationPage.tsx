import { json, Params, redirect } from 'react-router-dom';
import ConversationMain from '../components/Messenger/Conversation/ConversationMain';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';

const ConversationPage = () => {
  return <ConversationMain />;
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

    const image = formData.get('image') as File;
    const text = formData.get('text');

    if (image.name !== '' && text !== '') {
      formData.delete('text');
    }

    if (image.name === '') {
      formData.delete('image');
    }

    const httpConfig = generateHttpConfig({
      url: `${apiUrl}/api/v1/conversations/${params.id}/messages`,
      method: 'POST',
      allowCredentials: true,
      body: formData
    });

    const response = await sendHttpRequest(httpConfig);

    if (response.statusText === 'success') {
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
      return response;
    }

    throw json(response.message, { status: response.status });
  }
};
