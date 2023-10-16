interface ProfilePhotoProps {
  src: string;
  className?: string;
  alt?: string;
}

const ProfilePhoto = ({ src, alt, className }: ProfilePhotoProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full w-10 border-2 border-gray-300 ${className}`}
    />
  );
};

export default ProfilePhoto;
