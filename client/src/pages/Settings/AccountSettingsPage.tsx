import { useEffect } from 'react';
import AccountSettingsContent from '../../components/Settings/AccountSettings/AccountSettingsContent';
import MainContentContainer from '../../components/UI/MainContentContainer';
import PageHeader from '../../components/UI/PageHeader';

const AccountSettingsPage = () => {
  useEffect(() => {
    document.title = 'Account Settings | ZephyrMessenger';
  }, []);

  return (
    <MainContentContainer>
      <PageHeader heading="Account" backButtonUrl="/settings" />
      <AccountSettingsContent />
    </MainContentContainer>
  );
};

export default AccountSettingsPage;
