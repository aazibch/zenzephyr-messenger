import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto bg-white h-0 min-h-screen p-10">
      <div className="border rounded h-0 min-h-full">{children}</div>
    </div>
  );
};

export default Layout;
