import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import Conversation from './Conversation';
import { ConversationObj, UserObj } from '../../../../types';
import styles from './Conversations.module.css';
import { ReactElement, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

interface SocketUserDataObj {
  userId: string;
  socketId: string;
}

const Conversations = () => {
  const conversationsData = useLoaderData() as ConversationObj[];
  const newConversationUser = useRouteLoaderData('new-conversation') as
    | UserObj
    | undefined;
  const [conversations, setConversations] =
    useState<ConversationObj[]>(conversationsData);

  const getConversationsWithIsOnlineFalse = () => {
    const updatedConversations = conversations.map((conversation) => {
      return { ...conversation, isOnline: false };
    });

    return updatedConversations;
  };

  const updateOnlineState = (usersData: SocketUserDataObj[]) => {
    const conversations = getConversationsWithIsOnlineFalse();

    let updatedConversations;

    updatedConversations = conversations.map((conversation) => {
      const isOnline = usersData.some(
        (userData) =>
          userData.userId === conversation.otherParticipant._id.toString()
      );

      return { ...conversation, isOnline };
    });

    if (updatedConversations) {
      setConversations(updatedConversations);
    }
  };

  useEffect(() => {
    // Get online users from the server.
    socket.on('onlineUsers', (onlineUsers) => {
      updateOnlineState(onlineUsers);
    });

    return () => {
      // Cleanup when component unmounts
      socket.disconnect();
    };
  }, []);

  let conversationElements: ReactElement[] = [];

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
