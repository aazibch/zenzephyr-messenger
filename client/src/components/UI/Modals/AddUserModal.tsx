import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import Modal from './Modal';
import { useEffect, useRef, useState } from 'react';
import { UserObj } from '../../../types';
import { useFetcher, useNavigate } from 'react-router-dom';

interface AddUserModalProps {
  dismissHandler: () => void;
}

const AddUserModal = ({ dismissHandler }: AddUserModalProps) => {
  const [foundUser, setFoundUser] = useState<undefined | UserObj | null>(
    undefined
  );
  const [toUnblockUserId, setToUnblockUserId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showUnblockButton, setShowUnblockButton] = useState<boolean>(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    // User is sent with id only when the status is 'blockedByYou.'
    // This is because we need the id for the unblock button.
    if (
      fetcher.data?.recipientUser &&
      fetcher.data?.recipientUserStatus !== 'blockedByYou'
    ) {
      setFoundUser(fetcher.data.recipientUser);

      if (
        fetcher.formAction === '/messenger/:id' &&
        fetcher.data.recipientUser._id === toUnblockUserId
      ) {
        setToUnblockUserId(undefined);
        setErrorMessage(undefined);
        setShowUnblockButton(false);
      }
    }

    if (
      fetcher.data?.recipientUser === null ||
      fetcher.data?.recipientUserStatus === 'blockedByYou'
    ) {
      setFoundUser(null);
    }

    if (fetcher.data?.recipientUserStatus === 'blockedByYou') {
      setToUnblockUserId(fetcher.data.recipientUser._id);
    }

    if (fetcher.data?.recipientUserStatus === 'existingConversation') {
      setErrorMessage(
        'There is already an existing conversation with this user.'
      );
    }

    if (fetcher.data?.recipientUserStatus === 'blockedByOther') {
      setErrorMessage('You have been blocked by this user.');
    }

    if (fetcher.data?.recipientUserStatus === 'blockedByYou') {
      setErrorMessage('You have blocked this user.');
      setShowUnblockButton(true);
    }
  }, [fetcher.data]);

  const changeHandler = () => {
    if (foundUser !== undefined) {
      setFoundUser(undefined);
    }
    if (errorMessage !== undefined) {
      setErrorMessage(undefined);
    }
    if (showUnblockButton) {
      setShowUnblockButton(false);
    }
    if (toUnblockUserId) {
      setToUnblockUserId(undefined);
    }
  };

  const searchHandler = (username: string) => {
    fetcher.submit(
      { username },
      {
        action: '/messenger',
        method: 'POST',
        encType: 'application/json'
      }
    );
  };

  const addHandler = () => {
    if (foundUser) {
      navigate(`/messenger/new?userId=${foundUser._id}`);
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      searchHandler(usernameInputRef.current!.value);
    }
  };

  const unblockButtonHandler = () => {
    if (toUnblockUserId) {
      fetcher.submit(
        { id: toUnblockUserId, action: 'unblock' },
        {
          action: '/messenger/:id',
          method: 'PATCH',
          encType: 'application/json'
        }
      );
    }
  };

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/messenger';

  let recipientUserStatusElement;

  if (foundUser === null) {
    recipientUserStatusElement = (
      <div className="flex justify-center items-center px-2 bg-gray-50">
        <FaUserSlash className="text-red-500" size="1.15em" />
      </div>
    );
  }

  if (foundUser) {
    recipientUserStatusElement = (
      <div className="flex justify-center items-center px-2 bg-gray-50">
        <FaUserCheck className="text-yellow-400" size="1.15em" />
      </div>
    );
  }

  let errorMessageContent: React.ReactNode;

  if (errorMessage && showUnblockButton) {
    errorMessageContent = (
      <p className="text-red-500">
        {errorMessage} Click{' '}
        <a
          href="#"
          onClick={unblockButtonHandler}
          className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
        >
          here
        </a>{' '}
        to unblock the user.
      </p>
    );
  } else if (errorMessage) {
    errorMessageContent = <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <Modal.Body dismissHandler={dismissHandler}>
      <Modal.Header>
        <h3 className="text-xl font-semibold ">Add User</h3>
        <Button
          iconButton
          className="text-lg s-auto justify-center items-center"
          onClick={dismissHandler}
        >
          <IoClose />
        </Button>
      </Modal.Header>
      <Modal.Content>
        <div className="flex border rounded-md">
          <div className="flex grow">
            <input
              ref={usernameInputRef}
              onChange={changeHandler}
              onKeyDown={keyDownHandler}
              className="grow bg-gray-50 text-gray-900 text-sm focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block p-2"
            />
            {recipientUserStatusElement}
          </div>

          <button
            className="text-gray-600 bg-white border-l hover:bg-[#e5e5e5] disabled:hover:bg-white font-inter px-4 py-2 rounded-md rounded-l-none text-center disabled:opacity-50"
            onClick={() => searchHandler(usernameInputRef.current!.value)}
            type="button"
            disabled={isLoading}
          >
            Search
          </button>
        </div>

        <p className="text-gray-600">
          Please enter a username and select "Search." If a user is found, you
          can then proceed to select "Add."
        </p>

        {errorMessageContent && errorMessageContent}
      </Modal.Content>
      <Modal.Footer>
        <Button
          styleType="primary"
          className="mr-1"
          disabled={isLoading || !foundUser}
          onClick={addHandler}
        >
          Add
        </Button>
        <Button onClick={dismissHandler}>Cancel</Button>
      </Modal.Footer>
    </Modal.Body>
  );
};

export default AddUserModal;
