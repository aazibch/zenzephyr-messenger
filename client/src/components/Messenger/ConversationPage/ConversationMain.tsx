import MessageInputContainer from './MessageInputContainer/MessageInputContainer';
import ConversationMainContent from './ConversationMainContent/ConversationMainContent';
import ConversationMainHeader from './ConversationMainHeader';

const MessengerMain = () => {
  return (
    <div className="flex flex-col flex-grow">
      <ConversationMainHeader />
      <ConversationMainContent />
      <MessageInputContainer />
    </div>
  );
};

export default MessengerMain;
