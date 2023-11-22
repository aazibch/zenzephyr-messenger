import { json, Params, redirect } from 'react-router-dom';
import ConversationMain from '../components/Messenger/ConversationPage/ConversationMain';
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
};
