import { redirect } from 'react-router-dom';
import AuthFormContainer from '../../components/Auth/AuthFormContainer';
import { convertFormDataToObject, sendHttpRequest } from '../../utils';
import { generateHttpConfig } from '../../utils';
import { apiUrl } from '../../constants';

const SignupPage = () => {
  return <AuthFormContainer mode="signup" />;
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const body = await convertFormDataToObject(formData);

  const httpConfig = generateHttpConfig({
    url: `${apiUrl}/api/v1/users/signup`,
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
    localStorage.setItem(
      'tokenExpirationDate',
      response.data?.auth.tokenExpirationDate
    );
    localStorage.setItem('user', JSON.stringify(response.data?.user));
    return redirect('/');
  }
};

export default SignupPage;
