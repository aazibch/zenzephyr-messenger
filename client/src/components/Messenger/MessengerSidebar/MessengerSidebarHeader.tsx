import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfilePhoto from '../../UI/ProfilePhoto';
import Button from '../../UI/Button';

const SidebarHeader = () => {
  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      <ProfilePhoto src="https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg" />
      <div className="ml-auto">
        <Button iconButton className="mr-1">
          <BsPersonAdd size="1.25rem" />
        </Button>
        <Button iconButton>
          <BsThreeDotsVertical size="1.25rem" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
