import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import Message from './Message';
import { MessagesObj } from '../../../../types';
import { AuthObj } from '../../../../types';

const MessengerMainContent = () => {
  const auth = useRouteLoaderData('root') as AuthObj;
  const messagesData = useLoaderData() as MessagesObj;

  let messagesContent;

  if (messagesData.messages.length !== 0) {
    messagesContent = messagesData.messages.map((elem) => {
      return (
        <Message
          key={elem._id}
          byLoggedInUser={elem.sender.toString() === auth.user._id}
          message={elem.contentProps.text}
          timestamp="1 month ago"
        />
      );
    });
  }

  return (
    <div className="p-4 flex flex-col flex-grow overflow-y-auto">
      {messagesContent && messagesContent}
    </div>
  );
};

export default MessengerMainContent;
