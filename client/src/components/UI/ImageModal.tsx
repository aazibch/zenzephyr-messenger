import { IoIosClose } from 'react-icons/io';

const ImageModal = ({
  src,
  closeHandler
}: {
  src: string;
  closeHandler: () => void;
}) => {
  return (
    <div
      onClick={closeHandler}
      className="fixed top-0 left-0 z-10 w-screen h-screen bg-black/70 flex justify-center items-center"
    >
      {/* <!-- The close button --> */}
      <a
        className="fixed z-20 top-6 right-8 text-white text-5xl font-bold"
        href="javascript:void(0)"
        onClick={closeHandler}
      >
        <IoIosClose />
      </a>

      {/* <!-- Image --> */}
      <img
        src={src}
        alt="Open attached image"
        className="max-w-[800px] max-h-[600px] object-cover"
      />
    </div>
  );
};

export default ImageModal;
