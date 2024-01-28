import { Outlet, redirect } from 'react-router-dom';
import Layout from '../components/UI/Layout/Layout';
import { getTokenDuration } from '../utils/auth';
import AutoLogoutWrapper from '../components/Auth/AutoLogoutWrapper';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl, clientUrl } from '../constants';
import { clearAuthState } from '../utils/auth';
import SocketWrapper from '../components/WebSockets/SocketWrapper';

const RootPage = () => {
  return (
    <SocketWrapper>
      <AutoLogoutWrapper>
        <Layout>
          <Outlet />
        </Layout>
      </AutoLogoutWrapper>
    </SocketWrapper>
  );
};

export default RootPage;

export const loader = async ({ request }: { request: Request }) => {
  const tokenDuration = getTokenDuration();
  const isAuth = localStorage.getItem('isAuth');

  if (isAuth && tokenDuration < 0) {
    clearAuthState();
    return { status: 'EXPIRED' };
  }

  if (!isAuth) {
    return null;
  }

  if (isAuth && request.url === clientUrl) {
    return redirect('/messenger');
  }

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/me`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    return {
      status: 'AUTHENTICATED',
      tokenDuration,
      authenticatedUser: response.data?.authenticatedUser
    };
  }

  clearAuthState();
  return null;
};
