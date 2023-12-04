import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import useWhenClickedOutside from '../../../hooks/useWhenClickedOutside';
// import Backdrop from './Backdrop';

const DialogModal = ({
  heading,
  textBody,
  isLoading,
  dismissHandler,
  confirmHandler
}: {
  heading: string;
  textBody: string;
  isLoading: boolean;
  dismissHandler: () => void;
  confirmHandler: () => void;
}) => {
  const modalContentRef = useWhenClickedOutside(dismissHandler);

  return (
    <>
      {/* // <!-- Main modal --> */}
      <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center w-full inset-0 max-h-full bg-black/70">
        <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto mt-32">
          {/* <!-- Modal content --> */}
          <div
            ref={modalContentRef}
            className="relative bg-white rounded-lg shadow z-20"
          >
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-xl font-semibold ">{heading}</h3>
              <Button
                iconButton
                onClick={dismissHandler}
                className="text-lg s-auto justify-center items-center"
              >
                <IoClose />
              </Button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 ">
                {textBody}
              </p>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
              <Button
                styleType="primary"
                onClick={confirmHandler}
                className="mr-1"
                disabled={isLoading}
              >
                Confirm
              </Button>
              <Button onClick={dismissHandler}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogModal;
