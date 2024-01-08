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
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data) {
      setFoundUser(fetcher.data);
    }

    if (fetcher.data === null) {
      setFoundUser(null);
    }
  }, [fetcher.data]);

  const changeHandler = () => {
    if (foundUser !== undefined) {
      setFoundUser(undefined);
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

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/messenger';

  let userStatusElement;

  if (foundUser === null) {
    userStatusElement = (
      <div className="flex justify-center items-center px-2 bg-gray-50">
        <FaUserSlash className="text-red-500" size="1.15em" />
      </div>
    );
  }

  if (foundUser) {
    userStatusElement = (
      <div className="flex justify-center items-center px-2 bg-gray-50">
        <FaUserCheck className="text-yellow-400" size="1.15em" />
      </div>
    );
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
              className="grow bg-gray-50 text-gray-900 text-sm focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block p-2"
            />
            {userStatusElement}
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
