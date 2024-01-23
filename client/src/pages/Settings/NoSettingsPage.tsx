import { BiCog } from 'react-icons/bi';

const NoSettingsPage = () => {
  return (
    <div className="items-center flex-col flex-grow hidden md:flex">
      <div className="flex items-center flex-col text-center text-xl mt-32 text-gray-600">
        <BiCog size="2em" className="mb-2" />
        <p>Please select an option from the menu.</p>
      </div>
    </div>
  );
};

export default NoSettingsPage;
