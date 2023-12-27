import { Outlet, redirect } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import { getTokenDuration } from '../utils/auth';
import AutoLogoutWrapper from '../components/Auth/AutoLogoutWrapper';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl, clientUrl } from '../constants';
import { clearAuthState } from '../utils/auth';

const RootPage = () => {
  return (
    <AutoLogoutWrapper>
      <Layout>
        <Outlet />
      </Layout>
    </AutoLogoutWrapper>
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
      user: response.data?.user
    };
  }

  return null;
};
