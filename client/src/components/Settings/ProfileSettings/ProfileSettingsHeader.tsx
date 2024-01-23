import { IoIosArrowBack } from 'react-icons/io';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';

const ProfileSettingsHeader = () => {
  const navigate = useNavigate();

  const backButtonClickHandler = () => {
    navigate('/settings');
  };

  return (
    <div className="flex border-b border-gray-300 h-14 shrink-0 items-center px-4">
      <Button
        onClick={backButtonClickHandler}
        iconButton
        className="mr-3 md:hidden"
      >
        <IoIosArrowBack size="1.25em" />
      </Button>
      <h2>Profile</h2>
    </div>
  );
};

export default ProfileSettingsHeader;
