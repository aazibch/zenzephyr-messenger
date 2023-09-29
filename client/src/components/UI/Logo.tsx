import { BiPaperPlane } from 'react-icons/bi';

const Logo = ({ size, className }: { size?: string; className?: string }) => {
  let planeIconSizeClass = 'text-2xl';
  let textSizeClass = 'text-xl';

  if (size === 'lg') {
    planeIconSizeClass = 'text-4xl';
    textSizeClass = 'text-2xl';
  }

  return (
    <div className={`flex items-center text-slate-800 ${className}`}>
      <BiPaperPlane className={`inline ${planeIconSizeClass}`} />
      <span className={`inline-block ml-1 ${textSizeClass} font-semibold`}>
        ZephyrMessenger
      </span>
    </div>
  );
};

export default Logo;
