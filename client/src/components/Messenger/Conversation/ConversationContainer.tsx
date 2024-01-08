import MessageInputContainer from '../MessageInputContainer/MessageInputContainer';
import ConversationContent from './ConversationContent';
import ConversationHeader from './ConversationHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, ConversationObj } from '../../../types';
import socket from '../../../services/socket';
import { useEffect } from 'react';

const ConversationContainer = () => {
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
    socket.emit('updateActiveConversation', {
      userId: user._id,
      conversationId: activeConversation!._id
    });

    return () => {
      socket.emit('updateActiveConversation', {
        userId: user._id,
        conversationId: null
      });
    };
  }, [activeConversation]);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationHeader isBlockedByMe={isBlockedByMe} />
      <ConversationContent />
      <MessageInputContainer isBlocked={activeConversation!.isBlocked} />
    </div>
  );
};

export default ConversationContainer;
