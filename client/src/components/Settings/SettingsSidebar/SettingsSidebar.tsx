import SettingsNav from './SettingsNav/SettingsNav';
import SettingsSidebarHeader from './SettingsSidebarHeader';

const SettingsSidebar = () => {
  return (
    <div className="grow-0 shrink-0 border-r border-gray-300 basis-[20rem] h-full flex-col border">
      <SettingsSidebarHeader />
      <SettingsNav />
    </div>
  );
};

export default SettingsSidebar;
