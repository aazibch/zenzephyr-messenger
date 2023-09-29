import { Outlet } from 'react-router-dom';

const RootPage = () => {
  return (
    <div className="border rounded container mt-6 mx-auto bg-white">
      <Outlet />
    </div>
  );
};

export default RootPage;
