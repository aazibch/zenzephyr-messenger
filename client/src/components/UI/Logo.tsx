import { BiPaperPlane } from 'react-icons/bi';

const Logo = ({ className }: { size?: string; className?: string }) => {
  let planeIconSizeClass = 'text-[1.5em]';
  let textSizeClass = 'text-[1em]';

  return (
    <div
      className={`flex items-center text-slate-800 select-none ${className}`}
    >
      <BiPaperPlane className={`inline ${planeIconSizeClass}`} />
      <span className={`inline-block ml-1 ${textSizeClass} font-semibold`}>
        ZephyrMessenger
      </span>
    </div>
  );
};

export default Logo;
