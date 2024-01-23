import AccountSettingsContent from '../../components/Settings/AccountSettings/AccountSettingsContent';
import AccountSettingsHeader from '../../components/Settings/AccountSettings/AccountSettingsHeader';

const AccountSettingsPage = () => {
  return (
    <div className="flex-grow">
      <AccountSettingsHeader />
      <AccountSettingsContent />
    </div>
  );
};

export default AccountSettingsPage;
