import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import Conversation from './Conversation';
import { ConversationObj, UserObj } from '../../../../types';
import styles from './Conversations.module.css';

const Conversations = () => {
  const conversationsData = useLoaderData() as ConversationObj[];
  const newConversationUser = useRouteLoaderData('new-conversation') as
    | UserObj
    | undefined;

  let conversations = conversationsData.map((elem) => {
    return (
      <Conversation
        key={elem._id}
        link={`/messenger/${elem._id}`}
        profileImageUrl={elem.otherParticipant.profileImage}
        displayName={elem.otherParticipant.fullName}
        snippet={elem.snippet}
      />
    );
  });

  if (newConversationUser) {
    conversations.unshift(
      <Conversation
        key={newConversationUser._id}
        link={`/messenger/new?username=${newConversationUser.username}`}
        profileImageUrl={newConversationUser.profileImage}
        displayName={newConversationUser.fullName}
      />
    );
  }

  return (
    <div className={`h-full overflow-y-auto`}>
      <div className={styles.navItems}>{conversations}</div>
    </div>
  );
};

export default Conversations;
