import { useLoaderData, useParams, useRouteLoaderData } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import Conversation from './Conversation';
import { AuthObj, ConversationObj, UserObj } from '../../../../types';
import styles from './Conversations.module.css';
import MessengerContext from '../../../../store/messenger-context';

const Conversations = () => {
  const conversationsData = useLoaderData() as ConversationObj[];
  const newConversationUser = useRouteLoaderData('new-conversation') as
    | UserObj
    | undefined;
  const [conversations, setConversations] =
    useState<ConversationObj[]>(conversationsData);
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const params = useParams();
  const messengerCtx = useContext(MessengerContext);

  const { onlineUsers } = messengerCtx;

  const paramsRef = useRef(params.id);

  useEffect(() => {
    // Update the ref when params.id changes
    paramsRef.current = params.id;
  }, [params.id]);

  const getConversationsWithIsOnlineFalse = () => {
    const updatedConversations = conversationsData.map((conversation) => {
      return { ...conversation, isOnline: false };
    });

    return updatedConversations;
  };

  const updateConversationsWithOnlineState = () => {
    const conversations = getConversationsWithIsOnlineFalse();

    const updatedConversations = conversations.map((conversation) => {
      if (!conversation.isBlocked) {
        const isOnline = onlineUsers.some(
          (userData) =>
            userData.databaseId === conversation.otherParticipant._id
        );

        return { ...conversation, isOnline };
      }

      return conversation;
    });

    setConversations(updatedConversations);
  };

  useEffect(() => {
    updateConversationsWithOnlineState();
  }, [conversationsData, onlineUsers]);

  let conversationElements: React.ReactElement[] = [];

  if (conversations.length > 0) {
    conversationElements = conversations.map((elem) => {
      return (
        <Conversation
          key={elem._id}
          link={`/messenger/${elem._id}`}
          profileImageUrl={elem.otherParticipant.profileImage}
          displayName={elem.otherParticipant.fullName}
          snippet={elem.snippet}
          isOnline={elem.isOnline}
          isUnread={elem.unreadBy === user._id}
        />
      );
    });
  }

  if (newConversationUser) {
    conversationElements.unshift(
      <Conversation
        key={newConversationUser._id}
        link={`/messenger/new?userId=${newConversationUser._id}`}
        profileImageUrl={newConversationUser.profileImage}
        displayName={newConversationUser.fullName}
      />
    );
  }

  return (
    <div className={`h-full overflow-y-auto`}>
      <div className={styles.navItems}>{conversationElements}</div>
    </div>
  );
};

export default Conversations;
