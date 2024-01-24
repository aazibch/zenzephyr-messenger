import AccountSettingsContent from '../../components/Settings/AccountSettings/AccountSettingsContent';
import AccountSettingsHeader from '../../components/Settings/AccountSettings/AccountSettingsHeader';
import MainContentContainer from '../../components/UI/MainContentContainer';

const AccountSettingsPage = () => {
  return (
    <MainContentContainer>
      <AccountSettingsHeader />
      <AccountSettingsContent />
    </MainContentContainer>
  );
};

export default AccountSettingsPage;
