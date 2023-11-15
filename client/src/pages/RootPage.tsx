import { Outlet } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import { getTokenDuration } from '../utils/auth';
import AutoLogoutWrapper from '../components/Auth/AutoLogoutWrapper';

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

export const loader = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return { status: 'EXPIRED' };
  }

  return { status: 'AUTHENTICATED', tokenDuration, user: JSON.parse(user) };
};
