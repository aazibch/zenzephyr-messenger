import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';

import ProfilePhoto from '../UI/ProfilePhoto';
import Button from '../UI/Button';
import Conversation from '../Messenger/Conversation';

const HomeLoggedIn = () => {
  return (
    <div className="flex h-full">
      <div className="grow-0 shrink-0 border-r basis-[20rem] h-full flex-col">
        <div className="border-b flex items-center px-4 py-2">
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
        <div>
          <Conversation />
        </div>
      </div>
      <div className="flex-col">Messages Main</div>
    </div>
  );
};

export default HomeLoggedIn;
