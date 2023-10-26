import { Link } from 'react-router-dom';
import ProfilePhoto from '../../../UI/ProfilePhoto';

const Conversation = () => {
  return (
    <Link to="#" className="block hover:bg-gray-100">
      <div className="flex p-4 border-b items-center">
        <ProfilePhoto
          src="https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg"
          className="mr-3"
        />
        <div>
          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-2">John Doe</h3>
            <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-yellow-500"></div>
          </div>
          <p className="text-sm text-gray-600">
            Hi, I've been waiting to hear.
          </p>
        </div>
        <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-blue-500 ml-auto"></div>
      </div>
    </Link>
  );
};

export default Conversation;
