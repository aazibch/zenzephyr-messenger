interface ProfileImageProps {
  src: string;
  className?: string;
  size?: 'base' | 'large';
  clickHandler?: (imageSource: string) => void;
}

const ProfileImage = ({
  src,
  size = 'base',
  clickHandler,
  className
}: ProfileImageProps) => {
  let widthClass = 'w-10';
  let heightClass = 'h-10';

  if (size === 'large') {
    widthClass = 'w-14';
    heightClass = 'h-14';
  }

  const imgAttributes: {
    src: string;
    className: string;
    alt: string;
    onClick?: () => void;
  } = {
    src,
    alt: 'Profile image',
    className: `rounded-full object-cover h-full w-full`
  };

  if (clickHandler) {
    imgAttributes.onClick = () => clickHandler(src);
  }

  return (
    <div
      className={`rounded-full border-2 border-gray-300 ${widthClass} ${heightClass} ${className}`}
    >
      <img {...imgAttributes} />
    </div>
  );
};

export default ProfileImage;
