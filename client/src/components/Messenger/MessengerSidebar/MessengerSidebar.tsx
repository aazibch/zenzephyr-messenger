import SidebarContainer from '../../UI/SidebarContainer';
import Conversations from './Conversations/Conversations';
import MessengerSidebarHeader from './MessengerSidebarHeader';

const MessengerSidebar = () => {
  return (
    <SidebarContainer routeToHideOnWhenSmallScreen="/messenger/*">
      <MessengerSidebarHeader />
      <Conversations />
    </SidebarContainer>
  );
};

export default MessengerSidebar;
