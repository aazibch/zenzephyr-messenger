import { Outlet, redirect } from 'react-router-dom';
import AppIntro from '../components/UI/AppIntro';

const HomePage = () => {
  return (
    <div className="flex h-full">
      <section className="lg:flex hidden items-center justify-center basis-1/2 border-r p-4">
        <AppIntro />
      </section>
      <section className="border grow">
        <Outlet />
      </section>
    </div>
  );
};

export const loader = () => {
  const isAuthenticated = localStorage.getItem('isAuth');

  if (isAuthenticated) {
    return redirect('/messenger');
  }

  return null;
};

export default HomePage;
