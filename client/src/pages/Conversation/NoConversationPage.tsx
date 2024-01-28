import { useEffect } from 'react';
import { BiConversation } from 'react-icons/bi';
import MainContentContainer from '../../components/UI/MainContentContainer';

const NoConversationPage = () => {
  useEffect(() => {
    document.title = 'ZephyrMessenger - Connect with your favorite people';
  }, []);

  return (
    <MainContentContainer hideOnSmallScreen={true}>
      <div className="flex items-center flex-col text-center text-xl my-32 px-4 text-gray-600">
        <BiConversation size="2em" className="mb-2" />
        <p>Your selected conversation will appear here.</p>
      </div>
    </MainContentContainer>
  );
};

export default NoConversationPage;
