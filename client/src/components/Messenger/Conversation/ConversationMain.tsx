import MessageInputContainer from '../MessageInputContainer/MessageInputContainer';
import ConversationMainContent from './ConversationMainContent';
import ConversationMainHeader from './ConversationMainHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, ConversationObj } from '../../../types';
import socket from '../../../services/socket';
import { useEffect } from 'react';

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
    console.log('first', activeConversation!._id);
    socket.emit('updateActiveConversation', {
      userId: user._id,
      conversationId: activeConversation!._id
    });

    return () => {
      console.log('second');
      socket.emit('updateActiveConversation', {
        userId: user._id,
        conversationId: null
      });
    };
  }, [activeConversation]);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationMainHeader isBlockedByMe={isBlockedByMe} />
      <ConversationMainContent />
      <MessageInputContainer isBlocked={activeConversation!.isBlocked} />
    </div>
  );
};

export default ConversationMain;
