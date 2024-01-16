import { OptimisticMessageObj } from '../../../types';
import Message from './Message';

interface NewConversationContentProps {
  optimisticMessage: OptimisticMessageObj | undefined;
}

const NewConversationContent = ({
  optimisticMessage
}: NewConversationContentProps) => {
  return (
    <div className="p-4 flex flex-col flex-grow overflow-y-auto">
      {optimisticMessage && (
        <Message
          isOptimistic
          byLoggedInUser
          messageContent={optimisticMessage.contentProps}
        />
      )}
    </div>
  );
};

export default NewConversationContent;
