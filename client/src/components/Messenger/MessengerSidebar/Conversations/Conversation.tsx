import { Link } from 'react-router-dom';
import ProfilePhoto from '../../../UI/ProfilePhoto';

interface ConversationProps {
  profileImageUrl: string;
  displayName: string;
  snippet?: string;
  isOnline?: boolean;
  isUnread?: boolean;
}

const Conversation = ({
  profileImageUrl,
  displayName,
  snippet,
  isOnline,
  isUnread
}: ConversationProps) => {
  return (
    <Link to="#" className="block hover:bg-gray-100">
      <div className="flex p-4 border-b items-center">
        <ProfilePhoto src={profileImageUrl} className="mr-3" />
        <div>
          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-2">{displayName}</h3>
            {isOnline && (
              <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-yellow-500"></div>
            )}
          </div>
          <p className="text-sm text-gray-600">{snippet}</p>
        </div>
        {isUnread && (
          <div className="rounded-full h-[0.65rem] w-[0.65rem] bg-blue-500 ml-auto"></div>
        )}
      </div>
    </Link>
  );
};

export default Conversation;
