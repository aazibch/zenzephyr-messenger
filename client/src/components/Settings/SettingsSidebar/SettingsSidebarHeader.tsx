import { IoIosArrowBack } from 'react-icons/io';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';

const SettingsSidebarHeader = () => {
  const navigate = useNavigate();

  const backButtonClickHandler = () => {
    navigate('/messenger');
  };

  return (
    <div className="border-b border-gray-300 flex items-center px-4 h-14">
      <Button onClick={backButtonClickHandler} iconButton className="mr-3">
        <IoIosArrowBack size="1.25em" />
      </Button>
      <h2 className="font-semibold">Settings</h2>
    </div>
  );
};

export default SettingsSidebarHeader;
