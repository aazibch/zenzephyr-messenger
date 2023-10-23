import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfilePhoto from '../../UI/ProfilePhoto';
import Button from '../../UI/Button';
import DropdownMenu from '../../UI/DropdownMenu';

const menuItems = [
  {
    content: 'Settings',
    link: '/settings'
  },
  {
    content: 'Logout',
    link: '/logout'
  }
];

const SidebarHeader = () => {
  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      <ProfilePhoto src="https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg" />
      <div className="ml-auto">
        <Button iconButton className="mr-1">
          <BsPersonAdd size="1.25em" />
        </Button>
        <DropdownMenu
          buttonContent={<BsThreeDotsVertical size="1.25em" />}
          items={menuItems}
        />
      </div>
    </div>
  );
};

export default SidebarHeader;
