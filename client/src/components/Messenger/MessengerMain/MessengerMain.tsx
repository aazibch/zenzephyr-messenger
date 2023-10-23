import MessageInputContainer from './MessageInputContainer';
import MessengerMainContent from './MessengerMainContent/MessengerMainContent';
import MessengerMainHeader from './MessengerMainHeader';

const MessengerMain = () => {
  return (
    <div className="flex flex-col flex-grow">
      <MessengerMainHeader />
      <MessengerMainContent />
      <MessageInputContainer />
    </div>
  );
};

export default MessengerMain;
