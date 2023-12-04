import MessageInputContainer from './MessageInputContainer/MessageInputContainer';
import ConversationMainContent from './ConversationMainContent/ConversationMainContent';
import ConversationMainHeader from './ConversationMainHeader';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { ConversationObj } from '../../../types';

const ConversationMain = () => {
  const params = useParams();
  const conversationsData = useRouteLoaderData(
    'messenger'
  ) as ConversationObj[];

  const activeConversation = conversationsData.find(
    (elem) => elem._id.toString() === params.id
  );

  let isBlockedByMe = false;
  let blockedMessage;

  if (activeConversation!.blockedBy) {
    if (
      activeConversation!.blockedBy === activeConversation!.otherParticipant._id
    ) {
      blockedMessage = `${
        activeConversation!.otherParticipant.fullName
      } has blocked you.`;
    } else {
      isBlockedByMe = true;
      blockedMessage = `You have blocked ${
        activeConversation!.otherParticipant.fullName
      }.`;
    }
  }

  return (
    <div className="flex flex-col flex-grow">
      <ConversationMainHeader isBlockedByMe={isBlockedByMe} />
      <ConversationMainContent />
      <MessageInputContainer blockedMessage={blockedMessage} />
    </div>
  );
};

export default ConversationMain;
