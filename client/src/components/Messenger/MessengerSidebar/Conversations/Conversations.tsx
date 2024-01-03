import { useLoaderData, useParams, useRouteLoaderData } from 'react-router-dom';
import Conversation from './Conversation';
import {
  AuthObj,
  ConversationObj,
  MessageObj,
  UserObj
} from '../../../../types';
import styles from './Conversations.module.css';
import { ReactElement, useEffect, useState } from 'react';
import socket, { updateOnlineUsers } from '../../../../services/socket';
import { SocketUserDataObj } from '../../../../types';
import { onlineUsers } from '../../../../services/socket';

const Conversations = () => {
  const conversationsData = useLoaderData() as ConversationObj[];
  const newConversationUser = useRouteLoaderData('new-conversation') as
    | UserObj
    | undefined;
  const [conversations, setConversations] =
    useState<ConversationObj[]>(conversationsData);
  const auth = useRouteLoaderData('root') as AuthObj;
  const params = useParams();

  const getConversationsWithIsOnlineFalse = () => {
    const updatedConversations = conversationsData.map((conversation) => {
      return { ...conversation, isOnline: false };
    });

    return updatedConversations;
  };

  const updateOnlineState = (usersData: SocketUserDataObj[]) => {
    const conversations = getConversationsWithIsOnlineFalse();

    let updatedConversations;

    updatedConversations = conversations.map((conversation) => {
      if (!conversation.isBlocked) {
        const isOnline = usersData.some(
          (userData) =>
            userData.userId === conversation.otherParticipant._id.toString()
        );

        return { ...conversation, isOnline };
      }

      return conversation;
    });

    if (updatedConversations) {
      setConversations(updatedConversations);
    }
  };

  useEffect(() => {
    const onOnlineUsers = (updatedOnlineUsers: SocketUserDataObj[]) => {
      updateOnlineUsers(updatedOnlineUsers);
      updateOnlineState(onlineUsers);
    };

    const onChatMessage = (messageData: MessageObj) => {
      const conversationId = messageData.conversation.toString();
      let snippet: string;
      let updateSnippetOnly = false;

      if (messageData.contentProps.type === 'image') {
        snippet = '**[imageIcon] Image**';
      } else {
        snippet = messageData.contentProps.text.content;
      }

      if (conversationId === params.id) {
        updateSnippetOnly = true;
      }

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (updateSnippetOnly) {
            if (conversation._id.toString() === conversationId) {
              return {
                ...conversation,
                snippet
              };
            }
          }

          if (conversation._id.toString() === conversationId) {
            return {
              ...conversation,
              snippet,
              unreadBy: auth.user._id
            };
          }

          return conversation;
        });

        return updatedConversations;
      });
    };

    socket.on('onlineUsers', onOnlineUsers);
    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('onlineUsers', onOnlineUsers);
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

  useEffect(() => {
    updateOnlineState(onlineUsers);
  }, [conversationsData]);

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
          isUnread={elem.unreadBy?.toString() === auth.user._id}
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
