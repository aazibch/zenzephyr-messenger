import { useContext } from 'react';
import MessengerContext from '../store/messenger-context';
import HomeLoggedOut from '../components/Home/HomeLoggedOut';
import HomeLoggedIn from '../components/Home/HomeLoggedIn';

const HomePage = () => {
  const messengerCtx = useContext(MessengerContext);

  let content = <HomeLoggedOut />;

  if (messengerCtx.user) content = <HomeLoggedIn />;

  return content;
};

export default HomePage;
