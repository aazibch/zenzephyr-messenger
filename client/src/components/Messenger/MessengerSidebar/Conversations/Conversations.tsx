import { useLoaderData } from 'react-router-dom';
import Conversation from './Conversation';
import { ConversationObj } from '../../../../types';

const Conversations = () => {
  const conversationsData = useLoaderData() as ConversationObj[];

  const conversations = conversationsData.map((elem) => {
    return (
      <Conversation
        profileImageUrl={elem.otherParticipant.profileImage}
        displayName={elem.otherParticipant.displayName}
      />
    );
  });

  return <div className="h-full overflow-y-auto">{conversations}</div>;
};

export default Conversations;
