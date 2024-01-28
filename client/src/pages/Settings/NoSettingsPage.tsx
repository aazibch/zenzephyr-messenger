import { BiCog } from 'react-icons/bi';
import MainContentContainer from '../../components/UI/MainContentContainer';
import { useEffect } from 'react';

const NoSettingsPage = () => {
  useEffect(() => {
    document.title = 'Settings | ZephyrMessenger';
  }, []);

  return (
    <MainContentContainer hideOnSmallScreen={true}>
      <div className="flex items-center flex-col flex-grow">
        <div className="flex items-center flex-col text-center text-xl my-32 px-4 text-gray-600">
          <BiCog size="2em" className="mb-2" />
          <p>Please select an option from the menu.</p>
        </div>
      </div>
    </MainContentContainer>
  );
};

export default NoSettingsPage;
