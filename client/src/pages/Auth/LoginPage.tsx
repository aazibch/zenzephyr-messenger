import AuthFormContainer from '../../components/Auth/AuthFormContainer';
import { convertFormDataToObject, sendHttpRequest } from '../../utils';
import { generateHttpConfig } from '../../utils';
import { apiUrl } from '../../constants';
import { redirect } from 'react-router-dom';

const LoginPage = () => {
  return <AuthFormContainer mode="login" />;
};

export default LoginPage;

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = await convertFormDataToObject(formData);

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/login`,
    method: 'POST',
    allowCredentials: true,
    body: body
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.status === 'error') {
    throw response;
  }

  if (response.status === 'failure') {
    return response;
  }

  if (response.status === 'success') {
    console.log('loginPage', response.data?.auth);

    localStorage.setItem(
      'tokenExpirationDate',
      response.data?.auth.tokenExpirationDate
    );
    console.log('localStorage', localStorage.getItem('tokenExpirationDate'));
    localStorage.setItem('user', JSON.stringify(response.data?.user));
    return redirect('/');
  }
};
