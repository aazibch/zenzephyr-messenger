import { useSubmit, useRouteLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthObj } from '../../types';

const AuthLogoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const auth = useRouteLoaderData('root') as AuthObj;
  const submit = useSubmit();

  useEffect(() => {
    if (!auth) {
      // submit(null, { action: '/logout', method: 'post' });
      return;
    }

    if (auth.status === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
    }

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, auth.tokenDuration);
  }, [auth]);

  return children;
};

export default AuthLogoutWrapper;
