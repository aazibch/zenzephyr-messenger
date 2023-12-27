import { useEffect } from 'react';
import MessageInputContainer from '../MessageInputContainer/MessageInputContainer';
import ConversationMainContent from './ConversationMainContent';
import ConversationMainHeader from './ConversationMainHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, ConversationObj } from '../../../types';
import { socket } from '../../../services/socket';

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

  useEffect(() => {
    const onChatMessage = (message: any) => {
      console.log('[ConversationMain]["chatMessage" Listener]', message);
    };

    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationMainHeader isBlockedByMe={isBlockedByMe} />
      <ConversationMainContent />
      <MessageInputContainer isBlocked={activeConversation!.isBlocked} />
    </div>
  );
};

export default ConversationMain;
