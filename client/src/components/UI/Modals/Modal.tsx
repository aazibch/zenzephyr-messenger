import useWhenClickedOutside from '../../../hooks/useWhenClickedOutside';

interface ModalBodyProps {
  children: React.ReactNode;
  dismissHandler: () => void;
}

const Body = ({ children, dismissHandler }: ModalBodyProps) => {
  const modalBodyRef = useWhenClickedOutside(dismissHandler);

  return (
    <div
      ref={modalBodyRef}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center w-full inset-0 max-h-full bg-black/70"
    >
      <div className="relative p-2 w-full max-w-2xl max-h-full mx-auto mt-32">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow z-20">
          {children}
        </div>
      </div>
    </div>
  );
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
      {children}
    </div>
  );
};

const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 md:p-5 space-y-4">{children}</div>;
};

const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
      {children}
    </div>
  );
};

const Modal = {
  Body,
  Header,
  Content,
  Footer
};

export default Modal;
