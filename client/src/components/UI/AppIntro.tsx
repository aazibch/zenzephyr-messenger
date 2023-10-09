import Logo from './Logo';

const AppIntro = () => {
  return (
    <div className="w-96">
      <Logo className="text-[1.4rem]" />
      <p className="text-gray-800 mt-3">
        Join ZephyrMessenger, a fast, free, and secure application for
        connecting with your favorite people.
      </p>
    </div>
  );
};

export default AppIntro;
