import { useEffect, useState } from 'react';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfileImage from '../../UI/ProfileImage';
import Button from '../../UI/Button';
import DropdownMenu from '../../UI/DropdownMenu';
import {
  // useFetcher,
  useLocation,
  useRouteLoaderData,
  useSubmit
} from 'react-router-dom';
import { AuthObj } from '../../../types';
import ImageModal from '../../UI/Modals/ImageModal';
import AddUserModal from '../../UI/Modals/AddUserModal';

const SidebarHeader = () => {
  const [maximizedImage, setMaximizedImage] = useState<string | null>(null);
  const [displayingModal, setDisplayingModal] = useState<'addUser' | null>(
    null
  );
  const auth = useRouteLoaderData('root') as AuthObj;
  const location = useLocation();
  const submit = useSubmit();

  useEffect(() => {
    if (location.pathname === '/messenger/new') {
      if (displayingModal === 'addUser') {
        dismissModalHandler();
      }
    }
  }, [location, displayingModal]);

  const profileImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const addUserButtonHandler = () => {
    setDisplayingModal('addUser');
  };

  const dismissModalHandler = () => {
    setDisplayingModal(null);
    setMaximizedImage(null);
  };

  let modalElement;

  if (maximizedImage) {
    modalElement = (
      <ImageModal
        isProfileImage
        src={maximizedImage}
        closeHandler={dismissModalHandler}
      />
    );
  }

  if (displayingModal === 'addUser') {
    modalElement = <AddUserModal dismissHandler={dismissModalHandler} />;
  }

  const menuItems = [
    {
      content: 'Settings',
      link: '/settings'
    },
    {
      content: 'Logout',
      onClick: () => {
        submit(null, { action: '/logout', method: 'post' });
      }
    }
  ];

  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      {modalElement}
      <ProfileImage
        className="cursor-pointer"
        clickHandler={profileImageClickHandler}
        src={auth.authenticatedUser.profileImage}
      />
      <div className="ml-auto">
        <Button iconButton className="mr-1" onClick={addUserButtonHandler}>
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
