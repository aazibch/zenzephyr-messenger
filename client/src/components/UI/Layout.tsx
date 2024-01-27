const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container flex flex-col mx-auto box-border h-full p-2">
      <div className="bg-white border border-gray-300 rounded basis-[98%] overflow-auto mb-2">
        {children}
      </div>
      <footer className="flex flex-row-reverse">
        <p className="text-sm text-gray-600">
          Coded by{' '}
          <a
            className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
            href="https://github.com/aazibch"
          >
            Aazib Chaudhry
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default Layout;
