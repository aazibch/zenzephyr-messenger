import { Params, json } from 'react-router-dom';
import MessengerMain from '../components/Messenger/ConversationPage/MessengerMain';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';

const ConversationPage = () => {
  return <MessengerMain />;
};

export default ConversationPage;

export const loader = async ({ params }: { params: Params }) => {
  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/conversations/${params.id}/messages`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  console.log('[ConversationPage] response', response);

  if (response.statusText === 'success') {
    return response.data!.messages;
  }

  throw json({ message: 'Page not found.' }, { status: 404 });
};
