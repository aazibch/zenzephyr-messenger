import { useState } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useLoaderData } from 'react-router-dom';

import Button from '../../UI/Button';
import { MessagesObj } from '../../../types';
import DialogModal from '../../UI/Modals/DialogModal';

const MessengerMainHeader = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const messagesData = useLoaderData() as MessagesObj;

  const deleteButtonClickHandler = () => {
    setShowDeleteModal(true);
  };

  const dismissDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  // TODO: send HTTP request
  const deleteConversationHandler = () => {
    console.log('[deleteConversationHandler]');
  };

  return (
    <div className="flex border-b border-gray-300 h-14 items-center px-4">
      {showDeleteModal && (
        <DialogModal
          heading="Delete Conversation"
          textBody="Are you sure you want to delete this conversation?"
          dismissHandler={dismissDeleteModalHandler}
          confirmHandler={deleteConversationHandler}
        />
      )}
      <h2>{messagesData.otherParticipant.displayName}</h2>
      <Button onClick={deleteButtonClickHandler} iconButton className="ml-auto">
        <BsTrash3 size="1.25em" />
      </Button>
    </div>
  );
};

export default MessengerMainHeader;
