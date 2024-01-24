import SettingsNav from './SettingsNav/SettingsNav';
import SettingsSidebarHeader from './SettingsSidebarHeader';
import SidebarContainer from '../../UI/SidebarContainer';

const SettingsSidebar = () => {
  return (
    <SidebarContainer routeToHideOnWhenSmallScreen="/settings/*">
      <SettingsSidebarHeader />
      <SettingsNav />
    </SidebarContainer>
  );
};

export default SettingsSidebar;
