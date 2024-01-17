import { useEffect } from 'react';

const SettingsPage = () => {
  useEffect(() => {
    document.title = 'Settings | ZephyrMessenger';
  }, []);

  return <h1>Settings Page</h1>;
};

export default SettingsPage;
