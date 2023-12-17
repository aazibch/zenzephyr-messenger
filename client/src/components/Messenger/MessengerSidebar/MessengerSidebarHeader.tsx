import { useState } from 'react';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfileImage from '../../UI/ProfileImage';
import Button from '../../UI/Button';
import DropdownMenu from '../../UI/DropdownMenu';
import { useRouteLoaderData } from 'react-router-dom';
import { AuthObj } from '../../../types';
import ImageModal from '../../UI/Modals/ImageModal';
import AddUserModal from '../../UI/Modals/AddUserModal';

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
  const [maximizedImage, setMaximizedImage] = useState<string | null>(null);
  const [displayingModal, setDisplayingModal] = useState<'addUser' | null>(
    null
  );
  const auth = useRouteLoaderData('root') as AuthObj;

  const profileImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const addUserHandler = () => {
    setDisplayingModal('addUser');
  };

  const addUserCloseHandler = () => {
    setDisplayingModal(null);
  };

  const closeHandler = () => {
    setMaximizedImage(null);
  };

  let modalElement;

  if (displayingModal === 'addUser') {
    modalElement = <AddUserModal dismissHandler={addUserCloseHandler} />;
  }

  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      {modalElement}
      {maximizedImage && (
        <ImageModal
          isProfileImage
          src={maximizedImage}
          closeHandler={closeHandler}
        />
      )}
      <ProfileImage
        className="cursor-pointer"
        clickHandler={profileImageClickHandler}
        src={auth.user.profileImage}
      />
      <div className="ml-auto">
        <Button iconButton className="mr-1" onClick={addUserHandler}>
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
