import ProfileSettingsForm from './ProfileSettingsForm/ProfileSettingsForm';

const ProfileSettingsContent = () => {
  return (
    <div className="flex flex-col grow overflow-y-auto">
      <div className="w-full max-w-[40rem] mx-auto my-16 p-4">
        <ProfileSettingsForm />
      </div>
    </div>
  );
};

export default ProfileSettingsContent;
