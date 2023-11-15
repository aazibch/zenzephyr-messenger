import { BsTrash3 } from 'react-icons/bs';

import Button from '../../UI/Button';

const MessengerMainHeader = () => {
  return (
    <div className="flex border-b border-gray-300 h-14 items-center px-4">
      <h2>John Doe</h2>
      <Button iconButton className="ml-auto">
        <BsTrash3 size="1.25em" />
      </Button>
    </div>
  );
};

export default MessengerMainHeader;
