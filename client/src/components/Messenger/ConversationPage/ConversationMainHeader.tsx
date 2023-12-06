import { useEffect, useState } from 'react';
import { useLoaderData, useSubmit, useNavigation } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { MessagesObj } from '../../../types';
import DialogModal from '../../UI/Modals/DialogModal';
import DropdownMenu from '../../UI/DropdownMenu';

interface MessengerMainHeaderProps {
  isBlockedByMe: boolean;
}

const MessengerMainHeader = ({ isBlockedByMe }: MessengerMainHeaderProps) => {
  const [displayingModal, setDisplayingModal] = useState<
    'delete' | 'block' | 'unblock' | null
  >(null);
  const messagesData = useLoaderData() as MessagesObj;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'submitting' &&
    (navigation.formMethod === 'delete' || navigation.formMethod === 'patch') &&
    navigation.formAction === navigation.location.pathname;

  // After blocking/unblocking user, close the modal.
  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.formMethod === 'patch' &&
      navigation.formAction === navigation.location.pathname
    ) {
      setDisplayingModal(null);
    }
  }, [navigation]);

  const deleteButtonClickHandler = () => {
    setDisplayingModal('delete');
  };

  const dismissModalHandler = () => {
    setDisplayingModal(null);
  };

  const deleteConversationHandler = () => {
    submit(null, {
      method: 'DELETE'
    });
  };

  const blockUnblockButtonClickHandler = () => {
    setDisplayingModal(isBlockedByMe ? 'unblock' : 'block');
  };

  const blockUnblockUserHandler = () => {
    if (displayingModal === 'block') {
      return submit(
        { id: messagesData.otherParticipant._id, action: 'block' },
        {
          method: 'PATCH',
          encType: 'application/json'
        }
      );
    }

    if (displayingModal === 'unblock') {
      return submit(
        { id: messagesData.otherParticipant._id, action: 'unblock' },
        {
          method: 'PATCH',
          encType: 'application/json'
        }
      );
    }
  };

  console.log('isBlockedByMe', isBlockedByMe);

  const menuItems = [
    {
      content: isBlockedByMe ? 'Unblock User' : 'Block User',
      onClick: blockUnblockButtonClickHandler
    },
    {
      content: 'Delete Conversation',
      onClick: deleteButtonClickHandler
    }
  ];

  let modalElement;

  if (displayingModal === 'block' || displayingModal === 'unblock') {
    modalElement = (
      <DialogModal
        heading={`${
          displayingModal.charAt(0).toUpperCase() + displayingModal.slice(1)
        } User`}
        textBody={`Are you sure you want to ${displayingModal} this user?`}
        dismissHandler={dismissModalHandler}
        confirmHandler={blockUnblockUserHandler}
        isLoading={isLoading}
      />
    );
  }

  if (displayingModal === 'delete') {
    modalElement = (
      <DialogModal
        heading="Delete Conversation"
        textBody="Are you sure you want to delete this conversation?"
        dismissHandler={dismissModalHandler}
        confirmHandler={deleteConversationHandler}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex border-b border-gray-300 h-14 shrink-0 items-center px-4">
      {modalElement}
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
