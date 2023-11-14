import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import Conversation from './Conversation';
import { AuthObj } from '../../../../types';

const Conversations = () => {
  //TODO: To fix!
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const conversationsData = useLoaderData() as Record<string, any>[];

  const conversations = conversationsData.map((elem) => {
    const otherParticipant = elem.participants.find(
      (elem: Record<string, any>) => {
        return elem._id.toString() !== user._id;
      }
    );

    console.log('otherParticipant', otherParticipant);

    return (
      <Conversation
        profileImageUrl={otherParticipant.profileImage}
        displayName={otherParticipant.displayName}
        isOnline={true}
        isUnread={true}
      />
    );
  });

  return <div className="h-full overflow-y-auto">{conversations}</div>;
};

export default Conversations;
