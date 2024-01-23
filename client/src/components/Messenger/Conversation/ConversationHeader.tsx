import { useEffect, useState } from 'react';
import {
  useLoaderData,
  useSubmit,
  useNavigation,
  useRouteLoaderData,
  useNavigate
} from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { MessagesObj, UserObj } from '../../../types';
import DialogModal from '../../UI/Modals/DialogModal';
import DropdownMenu from '../../UI/DropdownMenu';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../../UI/Button';

interface ConversationHeaderProps {
  isBlockedByMe?: boolean;
}

const ConversationHeader = ({ isBlockedByMe }: ConversationHeaderProps) => {
  const [displayingModal, setDisplayingModal] = useState<
    'delete' | 'block' | 'unblock' | null
  >(null);
  const messagesData = useLoaderData() as MessagesObj;
  const submit = useSubmit();
  const navigation = useNavigation();
  const newConversationUser = useRouteLoaderData('new-conversation') as
    | UserObj
    | undefined;
  const navigate = useNavigate();

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

  let fullName;

  if (newConversationUser) {
    fullName = newConversationUser.fullName;
  } else {
    fullName = messagesData.otherParticipant.fullName;
  }

  const backButtonClickHandler = () => {
    navigate('/messenger');
  };

  return (
    <div className="flex border-b border-gray-300 h-14 shrink-0 items-center px-4">
      {modalElement}
      <Button
        onClick={backButtonClickHandler}
        iconButton
        className="mr-3 md:hidden"
      >
        <IoIosArrowBack size="1.25em" />
      </Button>
      <h2>{fullName}</h2>
      {!newConversationUser && (
        <div className="ml-auto">
          <DropdownMenu
            buttonContent={<BsThreeDotsVertical size="1.25em" />}
            items={menuItems}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;
