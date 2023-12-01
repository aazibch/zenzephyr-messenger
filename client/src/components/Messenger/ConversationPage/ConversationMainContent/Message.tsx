import { ReactElement } from 'react';
import ProfileImage from '../../../UI/ProfileImage';
import { TextContentProps, ImageContentProps } from '../../../../types';

interface MessageProps {
  byLoggedInUser?: boolean;
  profileImage?: string;
  messageContent: TextContentProps | ImageContentProps;
  timestamp: string;
  attachedImageClickHandler?: (imageSource: string) => void;
}

function calculateAspectRatioHeight(
  originalWidth: number,
  originalHeight: number,
  newWidth: number
) {
  const aspectRatio = originalWidth / originalHeight;
  const newHeight = newWidth / aspectRatio;
  return newHeight;
}

const Message = ({
  byLoggedInUser,
  profileImage,
  messageContent,
  timestamp,
  attachedImageClickHandler
}: MessageProps) => {
  let containerClassNames = 'mb-4';
  let messageClassNames = 'bg-gray-200 rounded-lg p-3 max-w-md';
  let contentClassNames = 'flex items-center mb-1';
  let metaClassNames = 'text-xs text-gray-600 block';
  let imageClassNames = 'w-full';

  if (attachedImageClickHandler) {
    imageClassNames += ' cursor-pointer';
  }

  if (byLoggedInUser) {
    containerClassNames = 'flex flex-col mb-4 items-end';
    messageClassNames = 'bg-[#508778] text-white rounded-lg p-3 max-w-md';
  }

  let messageContentElement: string | ReactElement = '';

  if (messageContent.type === 'text') {
    messageContentElement = messageContent.text.content;
  }

  if (messageContent.type === 'image') {
    const cutoffWidth = 236;
    const originalWidth = messageContent.image.width;
    const originalHeight = messageContent.image.height;
    let updatedWidth;
    let updatedHeight;

    if (originalWidth > cutoffWidth) {
      updatedWidth = cutoffWidth;
      updatedHeight = calculateAspectRatioHeight(
        originalWidth,
        originalHeight,
        cutoffWidth
      );
    } else {
      updatedWidth = originalWidth;
      updatedHeight = originalHeight;
    }

    messageContentElement = (
      <div style={{ width: `${updatedWidth}px`, height: `${updatedHeight}px` }}>
        <img
          className={imageClassNames}
          src={messageContent.image.url}
          alt="Attached Image"
          onClick={
            attachedImageClickHandler
              ? () => attachedImageClickHandler(messageContent.image.url)
              : undefined
          }
        />
      </div>
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
