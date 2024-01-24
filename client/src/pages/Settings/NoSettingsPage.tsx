import { BiCog } from 'react-icons/bi';
import MainContentContainer from '../../components/UI/MainContentContainer';

const NoSettingsPage = () => {
  return (
    <MainContentContainer hideOnSmallScreen={true}>
      <div className="flex items-center flex-col flex-grow">
        <div className="flex items-center flex-col text-center text-xl mt-32 text-gray-600">
          <BiCog size="2em" className="mb-2" />
          <p>Please select an option from the menu.</p>
        </div>
      </div>
    </MainContentContainer>
  );
};

export default NoSettingsPage;
