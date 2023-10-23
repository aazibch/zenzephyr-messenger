import ProfilePhoto from '../../../UI/ProfilePhoto';

const Message = ({ loggedInUsers }: { loggedInUsers?: boolean }) => {
  let containerClassNames = 'mb-4';
  let messageClassNames = 'bg-gray-200 rounded-lg p-3 max-w-md';
  let contentClassNames = 'flex items-center mb-1';
  let metaClassNames = 'text-xs text-gray-600 block';

  if (loggedInUsers) {
    containerClassNames = 'flex flex-col mb-4 items-end';
    messageClassNames = 'bg-[#508778] text-white rounded-lg p-3 max-w-md';
  }

  return (
    <div className={containerClassNames}>
      <div className={contentClassNames}>
        {!loggedInUsers && (
          <ProfilePhoto
            className="mr-2"
            src="https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg"
          />
        )}
        <div className={messageClassNames}>Hi Aazib, how are you doing?</div>
      </div>
      <span className={metaClassNames}>1 month ago</span>
    </div>
  );
};

export default Message;
