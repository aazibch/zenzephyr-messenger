interface MainContentContainerProps {
  children: React.ReactNode;
  hideOnSmallScreen?: boolean;
}

const MainContentContainer = ({
  children,
  hideOnSmallScreen
}: MainContentContainerProps) => {
  const classNames = ['grow', 'flex', 'flex-col', 'h-full'];

  if (hideOnSmallScreen) {
    classNames.push('hidden');
    classNames.push('lg:flex');
  }

  return <div className={classNames.join(' ')}>{children}</div>;
};

export default MainContentContainer;
