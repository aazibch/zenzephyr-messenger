import { Link } from 'react-router-dom';
import ProfilePhoto from '../../../UI/ProfilePhoto';
import { RiImageFill } from 'react-icons/ri';
import { ReactElement } from 'react';

interface ConversationProps {
  profileImageUrl: string;
  displayName: string;
  snippet?: string;
  isOnline?: boolean;
  isUnread?: boolean;
  link: string;
}

const Conversation = ({
  profileImageUrl,
  displayName,
  snippet,
  isOnline,
  isUnread,
  link
}: ConversationProps) => {
  let snippetContent: ReactElement | string | undefined = snippet;

  if (snippetContent === 'Image') {
    snippetContent = (
      <span>
        <RiImageFill className="inline-block" /> Image
      </span>
    );
  }

  return (
    <Link to={link} className="block hover:bg-gray-100">
      <div className="flex p-4 border-b items-center">
        <ProfilePhoto size="large" src={profileImageUrl} className="mr-3" />
        <div>
          <div className="flex items-center">
            <h3 className="font-medium mr-2">{displayName}</h3>
            {isOnline && (
              <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-yellow-500"></div>
            )}
          </div>
          {snippet && (
            <div className="text-sm text-gray-600">{snippetContent}</div>
          )}
        </div>
        {isUnread && (
          <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-blue-500 ml-auto"></div>
        )}
      </div>
    </Link>
  );
};

export default Conversation;
