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
    'grow',
    'border-r',
    'border-gray-300',
    'h-full',
    'flex-col',
    'md:basis-[25rem]',
    'md:grow-0'
  ];

  const routeToHideOn = routeToHideOnWhenSmallScreen;
  const routeToNotHideOn = routeToHideOnWhenSmallScreen.replace('*', '');

  if (useMatch(routeToHideOn) && !useMatch(routeToNotHideOn)) {
    sidebarClasses.push('hidden');
    sidebarClasses.push('md:block');
  }

  return <div className={sidebarClasses.join(' ')}>{children}</div>;
};

export default SidebarContainer;
