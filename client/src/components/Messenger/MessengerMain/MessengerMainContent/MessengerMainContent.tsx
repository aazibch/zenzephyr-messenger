import Message from './Message';

const MessengerMainContent = () => {
  return (
    <div className="p-4 flex flex-col flex-grow overflow-y-auto">
      <Message />
      <Message loggedInUsers />
    </div>
  );
};

export default MessengerMainContent;
