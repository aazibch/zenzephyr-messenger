import { IoIosClose } from 'react-icons/io';

const ImageModal = ({
  src,
  isProfileImage = false,
  closeHandler
}: {
  src: string;
  closeHandler: () => void;
  isProfileImage?: boolean;
}) => {
  let className = 'max-w-[800px] max-h-[600px] object-cover';

  if (isProfileImage) {
    className =
      'max-w-[300px] max-h-[300px] object-cover border-2 border-gray-300 rounded-full';
  }

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
      <img src={src} alt="Open attached image" className={className} />
    </div>
  );
};

export default ImageModal;
