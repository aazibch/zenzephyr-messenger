import { Suspense, useContext, useEffect, useCallback } from 'react';
import { Outlet, Await, defer, useLoaderData } from 'react-router-dom';
import { generateHttpConfig, sendHttpRequest } from '../utils';
import { apiUrl } from '../constants';
import Loader from '../components/UI/Loader';
import { HttpResponseDataObj } from '../types';
import MessengerContext from '../store/messenger-context';
import Layout from '../components/UI/Layout';

interface RootLoaderDataObj {
  authState: HttpResponseDataObj;
}

const RootPage = () => {
  const loaderData = useLoaderData() as RootLoaderDataObj;
  const messengerCtx = useContext(MessengerContext);

  // Setting state in effect function and not directly in the loader function
  // because we need the loaderData in the component to show loading state as it's loading.
  const setAuthState = useCallback(async () => {
    const authState = await loaderData.authState;
    console.log('loaderData', authState);
    if (authState.data?.user) {
      messengerCtx.login(authState.data.user);
    }
  }, [messengerCtx.login, loaderData]);

  useEffect(() => {
    setAuthState();
  }, [setAuthState]);

  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Await resolve={loaderData.authState}>{() => <Outlet />}</Await>
      </Suspense>
    </Layout>
  );
};

export default RootPage;

const getUser = async () => {
  const requestConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/me`,
    method: 'GET',
    allowCredentials: true
  });

  const response = await sendHttpRequest(requestConfig);
  console.log('response', response);
  return response;
};

export const loader = () => {
  return defer({
    authState: getUser()
  });
};
