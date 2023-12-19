import { Outlet, json, redirect } from 'react-router-dom';
import MessengerSidebar from '../components/Messenger/MessengerSidebar/MessengerSidebar';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { protect } from '../utils/auth';

const MessengerPage = () => {
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
