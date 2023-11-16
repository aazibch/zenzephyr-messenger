interface ProfilePhotoProps {
  src: string;
  className?: string;
  alt?: string;
  size?: 'base' | 'large';
}

const ProfilePhoto = ({
  src,
  alt,
  size = 'base',
  className
}: ProfilePhotoProps) => {
  let widthClass = 'w-10';

  if (size === 'large') {
    widthClass = 'w-14';
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ${widthClass} border-2 border-gray-300 ${className}`}
    />
  );
};

export default ProfilePhoto;
