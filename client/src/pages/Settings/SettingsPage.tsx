import { useEffect } from 'react';
import SettingsSidebar from '../../components/Settings/SettingsSidebar/SettingsSidebar';
import { Outlet } from 'react-router-dom';

const SettingsPage = () => {
  useEffect(() => {
    document.title = 'Settings | ZephyrMessenger';
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      <SettingsSidebar />
      <Outlet />
    </div>
  );
};

export default SettingsPage;
