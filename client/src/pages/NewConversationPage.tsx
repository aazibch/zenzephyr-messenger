import { json } from 'react-router-dom';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';

const NewConversationPage = () => {
  return (
    <div>
      <h1>NewConversationPage</h1>
    </div>
  );
};

export default NewConversationPage;

export const loader = async ({ request }: { request: Request }) => {
  const parsedUrl = new URL(request.url);
  const searchParams = new URLSearchParams(parsedUrl.searchParams);
  const username = searchParams.get('username');

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/${username}`,
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
