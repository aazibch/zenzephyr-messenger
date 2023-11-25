import { Form, useNavigation, useActionData } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { HttpResponseDataObj } from '../../types';

const SignupForm = () => {
  const navigation = useNavigation();
  const actionData = useActionData() as HttpResponseDataObj;

  const isLoading =
    (navigation.state === 'submitting' || navigation.state === 'loading') &&
    navigation.formData != null &&
    navigation.formAction === navigation.location?.pathname;

  return (
    <Form method="post" className="rounded-md">
      {actionData?.message && (
        <p className="mb-5 text-red-500 text-center">{actionData.message}</p>
      )}
      <Input
        className="mb-5"
        label="Username"
        input={{
          id: 'username',
          type: 'name',
          name: 'username'
        }}
      />
      <Input
        className="mb-5"
        label="Email"
        input={{
          id: 'email',
          type: 'email',
          name: 'email'
        }}
      />
      <Input
        className="mb-5"
        label="Password"
        input={{
          id: 'password',
          type: 'password',
          name: 'password'
        }}
      />
      <Input
        className="mb-5"
        label="Password Confirmation"
        input={{
          id: 'confirmPassword',
          type: 'password',
          name: 'confirmPassword'
        }}
      />
      <Button type="submit" styleType="primary" disabled={isLoading}>
        Signup
      </Button>
    </Form>
  );
};

export default SignupForm;
