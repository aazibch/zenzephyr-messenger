import { useMatch } from 'react-router-dom';

interface SidebarContainerProps {
  children: React.ReactNode;
  routeToHideOnWhenSmallScreen: string;
}

const SidebarContainer = ({
  children,
  routeToHideOnWhenSmallScreen
}: SidebarContainerProps) => {
  const sidebarClasses = [
    'md:border-r',
    'border-gray-300',
    'flex',
    'flex-col',
    'grow',
    'md:grow-0',
    'md:basis-[25rem]'
  ];

  const routeToHideOn = routeToHideOnWhenSmallScreen;
  const routeToNotHideOn = routeToHideOnWhenSmallScreen.replace('*', '');

  if (useMatch(routeToHideOn) && !useMatch(routeToNotHideOn)) {
    sidebarClasses.push('hidden');
    sidebarClasses.push('md:flex');
  }

  return <div className={sidebarClasses.join(' ')}>{children}</div>;
};

export default SidebarContainer;
