import { Outlet, json } from 'react-router-dom';
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
