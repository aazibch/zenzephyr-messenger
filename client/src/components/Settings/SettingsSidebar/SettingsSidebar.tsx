import { useMatch } from 'react-router-dom';
import SettingsNav from './SettingsNav/SettingsNav';
import SettingsSidebarHeader from './SettingsSidebarHeader';

const SettingsSidebar = () => {
  const sidebarClasses = [
    'grow',
    'shrink-0',
    'border-r',
    'border-gray-300',
    'h-full',
    'flex-col',
    'border',
    'md:basis-[25rem]',
    'md:grow-0'
  ];

  if (useMatch('/settings/*') && !useMatch('/settings/')) {
    sidebarClasses.push('hidden');
    sidebarClasses.push('md:block');
  }

  return (
    <div className={sidebarClasses.join(' ')}>
      <SettingsSidebarHeader />
      <SettingsNav />
    </div>
  );
};

export default SettingsSidebar;
