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

  if (size === 'large') {
    widthClass = 'w-14';
  }

  const imgAttributes: {
    src: string;
    className: string;
    alt: string;
    onClick?: () => void;
  } = {
    src,
    alt: 'Profile image',
    className: `rounded-full ${widthClass} border-2 border-gray-300 ${className}`
  };

  if (clickHandler) {
    imgAttributes.onClick = () => clickHandler(src);
  }

  return <img {...imgAttributes} />;
};

export default ProfileImage;
