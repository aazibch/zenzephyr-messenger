import { useState } from 'react';
import {
  useLoaderData,
  useParams,
  useSubmit,
  useNavigation
} from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { MessagesObj } from '../../../types';
import DialogModal from '../../UI/Modals/DialogModal';
import DropdownMenu from '../../UI/DropdownMenu';

const MessengerMainHeader = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const messagesData = useLoaderData() as MessagesObj;
  const submit = useSubmit();
  const params = useParams();
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'submitting' &&
    navigation.formMethod === 'delete' &&
    navigation.formAction === navigation.location.pathname;

  const deleteButtonClickHandler = () => {
    setShowDeleteModal(true);
  };

  const dismissDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  const deleteConversationHandler = () => {
    if (params.id) {
      submit(params.id, {
        method: 'delete'
      });
    }
  };

  const blockButtonClickHandler = () => {
    setShowBlockModal(true);
  };

  const dismissBlockModalHandler = () => {
    setShowBlockModal(false);
  };

  const blockUserHandler = () => {
    console.log('[blockUserHandler]');
  };

  const menuItems = [
    {
      content: 'Block User',
      onClick: blockButtonClickHandler
    },
    {
      content: 'Delete Conversation',
      onClick: deleteButtonClickHandler
    }
  ];

  return (
    <div className="flex border-b border-gray-300 h-14 shrink-0 items-center px-4">
      {showDeleteModal && (
        <DialogModal
          heading="Delete Conversation"
          textBody="Are you sure you want to delete this conversation?"
          dismissHandler={dismissDeleteModalHandler}
          confirmHandler={blockUserHandler}
          isLoading={isLoading}
        />
      )}
      {showBlockModal && (
        <DialogModal
          heading="Block User"
          textBody="Are you sure you want to block the user?"
          dismissHandler={dismissBlockModalHandler}
          confirmHandler={deleteConversationHandler}
          isLoading={isLoading}
        />
      )}
      <h2>{messagesData.otherParticipant.fullName}</h2>
      <div className="ml-auto">
        <DropdownMenu
          buttonContent={<BsThreeDotsVertical size="1.25em" />}
          items={menuItems}
        />
      </div>
    </div>
  );
};

export default MessengerMainHeader;
