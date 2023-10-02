import AuthFormContainer from '../../components/Auth/AuthFormContainer';
import { redirect, json } from 'react-router-dom';
import { convertFormDataToObject, sendHttpRequest } from '../../utils';
import { generateHttpConfig } from '../../utils';
import { apiUrl } from '../../constants';

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
    throw json({ message: response.message }, { status: response.httpStatus });
  }

  if (response.status === 'success') {
    // save user information to state.
    // redirect to home page.
    return redirect('/');
  }
};
