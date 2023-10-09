import { redirect, json } from 'react-router-dom';
import AuthFormContainer from '../../components/Auth/AuthFormContainer';
import { convertFormDataToObject, sendHttpRequest } from '../../utils';
import { generateHttpConfig } from '../../utils';
import { apiUrl } from '../../constants';
import { MessengerContextObj } from '../../types';

const SignupPage = () => {
  return <AuthFormContainer mode="signup" />;
};

export const action =
  (messengerCtx: MessengerContextObj) =>
  async ({ request }: { request: Request }) => {
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
      throw json(
        { message: response.message },
        { status: response.httpStatus }
      );
    }

    if (response.status === 'success') {
      // Narrowing
      if (response.data?.user) {
        messengerCtx.login(response.data.user);
        return redirect('/');
      }
    }
  };

export default SignupPage;
