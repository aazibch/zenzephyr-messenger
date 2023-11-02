import { useRouteLoaderData } from 'react-router-dom';
import HomeLoggedOut from '../components/Home/HomeLoggedOut';
import HomeLoggedIn from '../components/Home/HomeLoggedIn';
import { AuthObj } from '../types';

const HomePage = () => {
  const auth = useRouteLoaderData('root') as AuthObj;

  let content = <HomeLoggedOut />;

  if (auth?.status === 'AUTHENTICATED') content = <HomeLoggedIn />;

  return content;
};

export default HomePage;
