import { json, redirect } from 'react-router-dom';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import ConversationMainHeader from '../components/Messenger/Conversation/ConversationHeader';
import MessageInputContainer from '../components/Messenger/MessageInputContainer/MessageInputContainer';
import NewConversationMainContent from '../components/Messenger/Conversation/NewConversationMainContent';
const NewConversationPage = () => {
  return (
    <div className="flex flex-col justify-between flex-grow">
      <ConversationMainHeader />
      <NewConversationMainContent />
      <MessageInputContainer />
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

  if (response.statusText === 'success' && response.data!.user) {
    return response.data!.user;
  }

  if (response.statusText === 'success' && !response.data!.user) {
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
      return redirect(`/messenger/${response.data!.conversation._id}`);
    }

    throw json(response.message, { status: response.status });
  }
};
