import { Outlet } from 'react-router-dom';
import AppIntro from '../components/UI/AppIntro';

const HomePage = () => {
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

export default HomePage;
