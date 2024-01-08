import { NavLink } from 'react-router-dom';
import ProfileImage from '../../../UI/ProfileImage';
import { RiImageFill } from 'react-icons/ri';
import styles from './Conversations.module.css';

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
  let snippetContent: React.ReactElement | string | undefined = snippet;

  if (snippetContent === '**[imageIcon] Image**') {
    snippetContent = (
      <span>
        <RiImageFill className="inline-block" /> Image
      </span>
    );
  }

  return (
    <NavLink
      to={link}
      className={({ isActive }) => {
        return isActive ? styles.active : undefined;
      }}
    >
      <div className="flex p-4 border-b items-center">
        <ProfileImage size="large" src={profileImageUrl} className="mr-3" />
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
    </NavLink>
  );
};

export default Conversation;
