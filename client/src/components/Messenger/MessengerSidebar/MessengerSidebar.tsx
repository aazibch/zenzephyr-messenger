import SidebarContainer from '../../UI/SidebarContainer';
import Conversations from './Conversations/Conversations';
import MessengerSidebarHeader from './MessengerSidebarHeader';

const MessengerSidebar = () => {
  return (
    <SidebarContainer routeHiddenOn="/messenger/*">
      <MessengerSidebarHeader />
      <Conversations />
    </SidebarContainer>
  );
};

export default MessengerSidebar;
