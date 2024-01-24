interface MainContentContainerProps {
  children: React.ReactNode;
  hideOnSmallScreen?: boolean;
}

const MainContentContainer = ({
  children,
  hideOnSmallScreen
}: MainContentContainerProps) => {
  let classNames = ['grow'];

  if (hideOnSmallScreen) {
    classNames.push('hidden');
    classNames.push('md:block');
  }

  return <div className={classNames.join(' ')}>{children}</div>;
};

export default MainContentContainer;
