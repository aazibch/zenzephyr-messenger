import { redirect } from 'react-router-dom';
import { apiUrl } from '../../constants';
import { generateHttpConfig, sendHttpRequest } from '../../utils';

export const action = async () => {
  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/logout`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.status === 'success') {
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpirationDate');
    return redirect('/');
  }

  return null;
};
