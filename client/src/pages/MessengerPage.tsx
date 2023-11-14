import { json } from 'react-router-dom';
import HomeLoggedIn from '../components/Home/HomeLoggedIn';
import { apiUrl } from '../constants';
import { generateHttpConfig, sendHttpRequest } from '../utils';

const MessengerPage = () => {
  return <HomeLoggedIn />;
};

export default MessengerPage;

export const loader = async () => {
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
