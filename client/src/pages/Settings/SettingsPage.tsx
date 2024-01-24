import { useEffect } from 'react';
import SettingsSidebar from '../../components/Settings/SettingsSidebar/SettingsSidebar';
import { Outlet, json } from 'react-router-dom';
import { apiUrl } from '../../constants';
import { generateHttpConfig, sendHttpRequest } from '../../utils';
import { setAuthState } from '../../utils/auth';

const SettingsPage = () => {
  useEffect(() => {
    document.title = 'Settings | ZephyrMessenger';
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      <SettingsSidebar />
      <Outlet />
    </div>
  );
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/me`,
    method: 'PATCH',
    allowCredentials: true,
    body: formData
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'success') {
    if (response.data?.auth) {
      setAuthState(response.data?.auth.tokenExpirationDate);
    }

    return response;
  }

  if (response.statusText === 'failure') {
    return response;
  }

  throw json(response.message, { status: response.status });
};

export default SettingsPage;
