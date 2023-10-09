import { Outlet } from 'react-router-dom';
import AppIntro from '../UI/AppIntro';

const HomeLoggedOut = () => {
  return (
    <div className="flex h-full">
      <section className="flex items-center justify-center basis-1/2 border-r">
        <AppIntro />
      </section>
      <section className="flex items-center justify-center basis-1/2">
        <Outlet />
      </section>
    </div>
  );
};

export default HomeLoggedOut;
