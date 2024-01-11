import {
  useLoaderData,
  useParams,
  useRouteLoaderData,
  useRevalidator
} from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Conversation from './Conversation';
import {
  AuthObj,
  ConversationObj,
  MessageObj,
  UserObj
} from '../../../../types';
import styles from './Conversations.module.css';
import socket from '../../../../services/socket';
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
  const revalidator = useRevalidator();

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

  // useEffect(() => {
  //   if (revalidator.state === 'idle') {
  //     revalidator.revalidate();
  //   }
  // }, [params.id]);

  useEffect(() => {
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
        let updatedConversations = [...prevConversations];

        let itemToModify = updatedConversations.find(
          (item) => item._id === conversationId
        );

        updatedConversations = updatedConversations.filter(
          (item) => item._id !== conversationId
        );

        if (itemToModify) {
          if (updateSnippetOnly) {
            itemToModify.snippet = snippet;
          } else {
            itemToModify.snippet = snippet;
            itemToModify.unreadBy = user._id;
          }

          updatedConversations.unshift(itemToModify);
        }

        return updatedConversations;
      });
    };

    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

  useEffect(() => {
    updateConversationsWithOnlineState();
  }, [conversationsData, onlineUsers]);

  const conversationClickHandler = () => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate();
    }
  };

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
          onClickHandler={conversationClickHandler}
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
