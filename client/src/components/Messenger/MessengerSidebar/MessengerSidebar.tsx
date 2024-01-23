import { useMatch } from 'react-router-dom';
import Conversations from './Conversations/Conversations';
import SidebarHeader from './MessengerSidebarHeader';

const Sidebar = () => {
  const sidebarClasses = [
    'grow',
    'border-r',
    'border-gray-300',
    'h-full',
    'flex-col',
    'md:basis-[25rem]',
    'md:grow-0'
  ];

  if (useMatch('/messenger/*') && !useMatch('/messenger/')) {
    sidebarClasses.push('hidden');
    sidebarClasses.push('md:block');
  }

  return (
    <div className={sidebarClasses.join(' ')}>
      <SidebarHeader />
      <Conversations />
    </div>
  );
};

export default Sidebar;
