import MessageInput from '../MessageInput/MessageInput';
import ConversationContent from './ConversationContent';
import ConversationHeader from './ConversationHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, ConversationObj, SocketUserDataObj } from '../../../types';
import socket from '../../../services/socket';
import { useContext, useEffect } from 'react';
import MessengerContext from '../../../store/messenger-context';

const ConversationContainer = () => {
  const params = useParams();
  const conversationsData = useRouteLoaderData(
    'messenger'
  ) as ConversationObj[];
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const messengerCtx = useContext(MessengerContext);
  const activeConversation = conversationsData.find(
    (elem) => elem._id === params.id
  );

  let isBlockedByMe;

  if (!user.blockedUsers) {
    isBlockedByMe = false;
  } else {
    isBlockedByMe = user.blockedUsers.includes(
      activeConversation!.otherParticipant._id.toString()
    );
  }

  const activeConversationId = activeConversation?._id;
  const { onlineUsers } = messengerCtx;
  useEffect(() => {
    const socketUser: SocketUserDataObj | undefined = onlineUsers.find(
      (socketUser) => socketUser.databaseId === user._id
    );

    if (socketUser && socketUser.activeConversation !== activeConversationId) {
      socket.emit('updateActiveConversation', {
        databaseId: user._id,
        conversationId: activeConversationId
      });
    }
  }, [activeConversationId, onlineUsers]);

  useEffect(() => {
    return () => {
      socket.emit('updateActiveConversation', {
        databaseId: user._id,
        conversationId: null
      });
    };
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationHeader isBlockedByMe={isBlockedByMe} />
      <ConversationContent />
      <MessageInput isBlocked={activeConversation!.isBlocked} />
    </div>
  );
};

export default ConversationContainer;
