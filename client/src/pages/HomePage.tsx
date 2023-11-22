import { Outlet, redirect } from 'react-router-dom';
import AppIntro from '../components/UI/AppIntro';
import { getTokenDuration } from '../utils/auth';

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

export const loader = () => {
  const user = localStorage.getItem('user');
  const duration = getTokenDuration();

  if (duration <= 0) {
    redirect('/logout');
  }

  if (user) {
    return redirect('/messenger');
  }

  return null;
};

export default HomePage;
