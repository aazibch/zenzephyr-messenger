import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import { FaUserCheck } from 'react-icons/fa';
import Modal from './Modal';

interface AddUserModalProps {
  userFound?: boolean;
  dismissHandler: () => void;
}

const AddUserModal = ({ userFound, dismissHandler }: AddUserModalProps) => {
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
        <form>
          <div className="flex border rounded-md">
            <div className="flex grow">
              <input className="grow bg-gray-50 text-gray-900 text-sm focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block p-2" />
              {userFound && (
                <div className="flex justify-center items-center px-2 bg-gray-50">
                  <FaUserCheck className="text-yellow-400" size="1.15em" />
                </div>
              )}
            </div>
            <button className="text-gray-600 bg-white border-l hover:bg-[#e5e5e5] disabled:hover:bg-white font-inter px-4 py-2 rounded-md rounded-l-none text-center disabled:opacity-50">
              Search
            </button>
          </div>
        </form>
      </Modal.Content>
      <Modal.Footer>
        <Button styleType="primary" className="mr-1">
          Add
        </Button>
        <Button onClick={dismissHandler}>Cancel</Button>
      </Modal.Footer>
    </Modal.Body>
  );
};

export default AddUserModal;
