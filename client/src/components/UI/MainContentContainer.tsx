interface MainContentContainerProps {
  children: React.ReactNode;
  hideOnSmallScreen?: boolean;
}

const MainContentContainer = ({
  children,
  hideOnSmallScreen
}: MainContentContainerProps) => {
  const classNames = ['grow'];

  if (hideOnSmallScreen) {
    classNames.push('hidden');
    classNames.push('md:flex');
  }

  return <div className={classNames.join(' ')}>{children}</div>;
};

export default MainContentContainer;
