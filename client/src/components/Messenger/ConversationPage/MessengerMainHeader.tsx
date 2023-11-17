import { BsTrash3 } from 'react-icons/bs';

import Button from '../../UI/Button';
import { useLoaderData } from 'react-router-dom';
import { MessagesObj } from '../../../types';

const MessengerMainHeader = () => {
  const messagesData = useLoaderData() as MessagesObj;

  return (
    <div className="flex border-b border-gray-300 h-14 items-center px-4">
      <h2>{messagesData.otherParticipant.displayName}</h2>
      <Button iconButton className="ml-auto">
        <BsTrash3 size="1.25em" />
      </Button>
    </div>
  );
};

export default MessengerMainHeader;
