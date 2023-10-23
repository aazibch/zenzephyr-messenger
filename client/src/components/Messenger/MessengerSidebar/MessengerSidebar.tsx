import Conversations from './Conversations/Conversations';
import SidebarHeader from './MessengerSidebarHeader';

const Sidebar = () => {
  return (
    <div className="grow-0 shrink-0 border-r border-gray-300 basis-[25rem] h-full flex-col">
      <SidebarHeader />
      <Conversations />
    </div>
  );
};

export default Sidebar;
