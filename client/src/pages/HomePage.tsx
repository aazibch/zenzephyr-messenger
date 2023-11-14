import { redirect } from 'react-router-dom';
import HomeLoggedOut from '../components/Home/HomeLoggedOut';

const HomePage = () => {
  return <HomeLoggedOut />;
};

export const loader = () => {
  const user = localStorage.getItem('user');

  if (user) {
    return redirect('/messenger');
  }

  return null;
};

export default HomePage;
