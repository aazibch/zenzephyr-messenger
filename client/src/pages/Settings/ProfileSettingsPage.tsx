import { useEffect } from 'react';
import ProfileSettingsContent from '../../components/Settings/ProfileSettings/ProfileSettingsContent';
import MainContentContainer from '../../components/UI/MainContentContainer';
import PageHeader from '../../components/UI/PageHeader';

const ProfileSettingsPage = () => {
  useEffect(() => {
    document.title = 'Profile Settings | ZephyrMessenger';
  }, []);

  return (
    <MainContentContainer>
      <PageHeader heading="Profile" backButtonUrl="/settings" />
      <ProfileSettingsContent />
    </MainContentContainer>
  );
};

export default ProfileSettingsPage;
