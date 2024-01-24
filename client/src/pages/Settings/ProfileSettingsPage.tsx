import ProfileSettingsContent from '../../components/Settings/ProfileSettings/ProfileSettingsContent';
import ProfileSettingsHeader from '../../components/Settings/ProfileSettings/ProfileSettingsHeader';
import MainContentContainer from '../../components/UI/MainContentContainer';

const ProfileSettingsPage = () => {
  return (
    <MainContentContainer>
      <ProfileSettingsHeader />
      <ProfileSettingsContent />
    </MainContentContainer>
  );
};

export default ProfileSettingsPage;
