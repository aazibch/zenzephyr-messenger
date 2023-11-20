import { ReactElement } from 'react';
import ProfileImage from '../../../UI/ProfileImage';

interface MessageProps {
  byLoggedInUser?: boolean;
  profileImage?: string;
  messageType: 'image' | 'text';
  messageContent: string;
  timestamp: string;
  attachedImageClickHandler?: (imageSource: string) => void;
}

const Message = ({
  byLoggedInUser,
  profileImage,
  messageType,
  messageContent,
  timestamp,
  attachedImageClickHandler
}: MessageProps) => {
  let containerClassNames = 'mb-4';
  let messageClassNames = 'bg-gray-200 rounded-lg p-3 max-w-md';
  let contentClassNames = 'flex items-center mb-1';
  let metaClassNames = 'text-xs text-gray-600 block';

  if (byLoggedInUser) {
    containerClassNames = 'flex flex-col mb-4 items-end';
    messageClassNames = 'bg-[#508778] text-white rounded-lg p-3 max-w-md';
  }

  let messageContentElement: string | ReactElement = messageContent;

  if (messageType === 'image' && attachedImageClickHandler) {
    messageContentElement = (
      <img
        className="max-w-sm cursor-pointer"
        src={messageContent}
        alt="Attached Image"
        onClick={() => attachedImageClickHandler(messageContent)}
      />
    );
  }

  return (
    <div className={containerClassNames}>
      <div className={contentClassNames}>
        {!byLoggedInUser && profileImage && (
          <ProfileImage className="mr-2" src={profileImage} />
        )}
        <div className={messageClassNames}>{messageContentElement}</div>
      </div>
      <span className={metaClassNames}>{timestamp}</span>
    </div>
  );
};

export default Message;
