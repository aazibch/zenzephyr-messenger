import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container flex flex-col mx-auto box-border h-full p-2">
      <div className="bg-white border border-gray-300 rounded grow overflow-auto mb-2">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
