import MessageInputContainer from './MessageInputContainer/MessageInputContainer';
import ConversationMainContent from './ConversationMainContent/ConversationMainContent';
import ConversationMainHeader from './ConversationMainHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, ConversationObj } from '../../../types';

const ConversationMain = () => {
  const params = useParams();
  const conversationsData = useRouteLoaderData(
    'messenger'
  ) as ConversationObj[];
  const user = (useRouteLoaderData('root') as AuthObj).user;

  const activeConversation = conversationsData.find(
    (elem) => elem._id.toString() === params.id
  );

  let isBlockedByMe;

  if (!user.blockedUsers) {
    isBlockedByMe = false;
  } else {
    isBlockedByMe = user.blockedUsers.includes(
      activeConversation!.otherParticipant._id.toString()
    );
  }

  console.log('user.blockedUsers', user.blockedUsers);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationMainHeader isBlockedByMe={isBlockedByMe} />
      <ConversationMainContent />
      <MessageInputContainer isBlocked={activeConversation!.isBlocked} />
    </div>
  );
};

export default ConversationMain;
