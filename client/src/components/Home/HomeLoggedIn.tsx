import MessengerSidebar from '../Messenger/MessengerSidebar/MessengerSidebar';
import MessengerMain from '../Messenger/MessengerMain/MessengerMain';

const HomeLoggedIn = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <MessengerSidebar />
      <MessengerMain />
    </div>
  );
};

export default HomeLoggedIn;
