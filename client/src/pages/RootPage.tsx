import { Outlet } from 'react-router-dom';

const RootPage = () => {
  return (
    <div className="border rounded container my-6 mx-auto bg-white h-0 min-h-screen">
      <Outlet />
    </div>
  );
};

export default RootPage;
