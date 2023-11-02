import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { useSubmit } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import { getTokenDuration } from '../utils/auth';
import { AuthObj } from '../types';

const RootPage = () => {
  const auth = useLoaderData() as AuthObj;
  const submit = useSubmit();

  useEffect(() => {
    if (!auth) {
      return;
    }

    if (auth.status === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
    }

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, auth.tokenDuration);
  }, [auth]);

  return (
    <Layout>
      <Outlet />
    </Layout>
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

  return { status: 'AUTHENTICATED', tokenDuration, user };
};
