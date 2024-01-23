import { BiConversation } from 'react-icons/bi';

const NoConversationPage = () => {
  return (
    <div className="hidden items-center flex-col grow md:flex p-4">
      <div className="flex items-center flex-col text-center text-xl mt-32 text-gray-600">
        <BiConversation size="2em" className="mb-2" />
        <p>Your selected conversation will appear here.</p>
      </div>
    </div>
  );
};

export default NoConversationPage;
