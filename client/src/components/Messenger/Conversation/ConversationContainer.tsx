import MessageInput from '../MessageInput/MessageInput';
import ConversationContent from './ConversationContent';
import ConversationHeader from './ConversationHeader';
import {
  // useLocation,
  useNavigation,
  useParams,
  useRevalidator,
  useRouteLoaderData
} from 'react-router-dom';
import {
  AuthObj,
  ConversationObj,
  // MessageObj,
  OptimisticMessageObj,
  SocketUserDataObj
} from '../../../types';
import socket from '../../../services/socket';
import { useContext, useEffect, useState } from 'react';
import MessengerContext from '../../../store/messenger-context';

const ConversationContainer = () => {
  const params = useParams();
  const conversationsData = useRouteLoaderData(
    'messenger'
  ) as ConversationObj[];
  const [optimisticMessages, setOptimisticMessages] = useState<
    OptimisticMessageObj[]
  >([]);
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const messengerCtx = useContext(MessengerContext);
  const activeConversation = conversationsData.find(
    (elem) => elem._id === params.id
  );
  const revalidator = useRevalidator();
  const navigation = useNavigation();

  let isBlockedByMe;

  if (!user.blockedUsers) {
    isBlockedByMe = false;
  } else {
    isBlockedByMe = user.blockedUsers.includes(
      activeConversation!.otherParticipant._id.toString()
    );
  }

  const activeConversationId = params.id;
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

  useEffect(() => {
    const onBlockedOrUnblockedConversation = () => {
      if (revalidator.state === 'idle') {
        revalidator.revalidate();
      }
    };

    socket.on(
      'blockedOrUnblockedConversation',
      onBlockedOrUnblockedConversation
    );

    return () => {
      socket.off(
        'blockedOrUnblockedConversation',
        onBlockedOrUnblockedConversation
      );
    };
  }, []);

  useEffect(() => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate();
    }
  }, [activeConversationId]);

  const saveOptimisticMessage = (optimisticMessage: OptimisticMessageObj) => {
    setOptimisticMessages((prevOptimisticMessages) => [
      ...prevOptimisticMessages,
      optimisticMessage
    ]);
  };

  const isIdle =
    navigation.state === 'idle' && activeConversationId === params.id;

  location.pathname.startsWith('/messenger/');
  useEffect(() => {
    if (isIdle) {
      setOptimisticMessages([]);
    }
  }, [isIdle]);

  return (
    <div className="flex flex-col flex-grow">
      <ConversationHeader isBlockedByMe={isBlockedByMe} />
      <ConversationContent optimisticMessages={optimisticMessages} />
      <MessageInput
        recipientId={activeConversation!.otherParticipant._id}
        saveOptimisticMessage={saveOptimisticMessage}
        isBlocked={activeConversation!.isBlocked}
      />
    </div>
  );
};

export default ConversationContainer;
