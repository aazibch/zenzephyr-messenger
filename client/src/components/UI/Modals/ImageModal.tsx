import { useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import useWhenClickedOutside from '../../../hooks/useWhenClickedOutside';

interface ImageModalProps {
  src: string;
  isProfileImage?: boolean;
  closeHandler: () => void;
}

const ImageModal = ({
  src,
  isProfileImage = false,
  closeHandler
}: ImageModalProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  let imageClassNames = 'w-full max-w-[800px] h-auto object-cover';
  const imageContainerRef = useWhenClickedOutside(closeHandler);

  if (isProfileImage) {
    imageClassNames =
      'w-full max-w-[300px] h-auto object-cover border-2 border-gray-300 rounded-full';
  }

  return (
    <div className="px-2 fixed top-0 left-0 z-10 w-screen h-screen bg-black/70 flex justify-center items-center">
      {/* <!-- The close button --> */}
      <span
        className="fixed z-20 top-6 right-8 text-white text-5xl font-bold cursor-pointer"
        onClick={closeHandler}
      >
        <IoClose />
      </span>

      {/* <!-- Image --> */}
      <div className="border-red-700" ref={imageContainerRef}>
        <img
          ref={imageRef}
          src={src}
          alt="Open attached image"
          className={imageClassNames}
        />
      </div>
    </div>
  );
};

export default ImageModal;
