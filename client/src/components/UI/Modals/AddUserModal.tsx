import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import { FaUserCheck } from 'react-icons/fa';

interface AddUserModalProps {
  userFound?: boolean;
}

const AddUserModal = ({ userFound }: AddUserModalProps) => {
  return (
    <>
      {/* // <!-- Main modal --> */}
      <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center w-full inset-0 max-h-full bg-black/70">
        <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto mt-32">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow z-20">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-xl font-semibold ">Add User</h3>
              <Button
                iconButton
                className="text-lg s-auto justify-center items-center"
              >
                <IoClose />
              </Button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5 space-y-4">
              <form>
                <div className="flex border rounded-md">
                  <div className="flex grow">
                    <input className="grow bg-gray-50 text-gray-900 text-sm focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block p-2" />
                    {userFound && (
                      <div className="flex justify-center items-center px-2 bg-gray-50">
                        <FaUserCheck
                          className="text-yellow-400"
                          size="1.15em"
                        />
                      </div>
                    )}
                  </div>
                  <button className="text-gray-600 bg-white border-l hover:bg-[#f7f7f7] disabled:hover:bg-white font-inter px-4 py-2 rounded-md rounded-l-none text-center disabled:opacity-50">
                    Search
                  </button>
                </div>
              </form>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
              <Button styleType="primary" className="mr-1">
                Add
              </Button>
              <Button>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
