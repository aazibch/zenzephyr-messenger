import { json, redirect } from 'react-router-dom';
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  const response = await sendHttpRequest(httpConfig);

  if (response.statusText === 'error') {
    throw json(response.message, { status: response.status });
  }

  if (response.statusText === 'failure') {
    return response;
  }

  if (response.statusText === 'success') {
    localStorage.setItem(
      'tokenExpirationDate',
      response.data?.auth.tokenExpirationDate
    );
    localStorage.setItem('user', JSON.stringify(response.data?.user));
    return redirect('/');
  }
};

export default SignupPage;
