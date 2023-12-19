import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import Modal from './Modal';
import { useRef } from 'react';
import { UserObj } from '../../../types';

interface AddUserModalProps {
  foundUser: UserObj | null;
  isLoading: boolean;
  searchHandler: (username: string) => void;
  dismissHandler: () => void;
}

const AddUserModal = ({
  foundUser,
  isLoading,
  dismissHandler,
  searchHandler
}: AddUserModalProps) => {
  const usernameInputRef = useRef<HTMLInputElement>(null);

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
          disabled={isLoading || !foundUser}
          className="mr-1"
        >
          Add
        </Button>
        <Button onClick={dismissHandler}>Cancel</Button>
      </Modal.Footer>
    </Modal.Body>
  );
};

export default AddUserModal;
