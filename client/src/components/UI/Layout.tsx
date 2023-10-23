import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto box-border h-full p-4">
      <div className="bg-white border border-gray-300 rounded h-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
