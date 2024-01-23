import ProfileSettingsContent from '../../components/Settings/ProfileSettings/ProfileSettingsContent';
import ProfileSettingsHeader from '../../components/Settings/ProfileSettings/ProfileSettingsHeader';

const ProfileSettingsPage = () => {
  return (
    <div className="flex-grow">
      <ProfileSettingsHeader />
      <ProfileSettingsContent />
    </div>
  );
};

export default ProfileSettingsPage;
