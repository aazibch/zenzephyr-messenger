import { redirect } from 'react-router-dom';
import { apiUrl } from '../../constants';
import { generateHttpConfig, sendHttpRequest } from '../../utils';
import { clearAuthState } from '../../utils/auth';

export const action = async () => {
  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/logout`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    clearAuthState();
    return redirect('/');
  }

  return null;
};
