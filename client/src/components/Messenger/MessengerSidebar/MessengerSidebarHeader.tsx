import { useState } from 'react';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfileImage from '../../UI/ProfileImage';
import Button from '../../UI/Button';
import DropdownMenu from '../../UI/DropdownMenu';
import { useFetcher, useRouteLoaderData } from 'react-router-dom';
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
  const fetcher = useFetcher();
  const auth = useRouteLoaderData('root') as AuthObj;
  const foundUser = fetcher.data;

  const profileImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const addUserButtonHandler = () => {
    setDisplayingModal('addUser');
  };

  const addUserSearchHandler = (username: string) => {
    fetcher.submit(
      { username },
      {
        action: '/messenger',
        method: 'POST',
        encType: 'application/json'
      }
    );
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

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/messenger';

  if (displayingModal === 'addUser') {
    modalElement = (
      <AddUserModal
        isLoading={isLoading}
        foundUser={foundUser}
        dismissHandler={dismissModalHandler}
        searchHandler={addUserSearchHandler}
      />
    );
  }

  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      {modalElement}
      <ProfileImage
        className="cursor-pointer"
        clickHandler={profileImageClickHandler}
        src={auth.user.profileImage}
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
