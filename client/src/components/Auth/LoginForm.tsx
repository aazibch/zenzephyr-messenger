import { useNavigation, Form, useActionData } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { HttpResponseDataObj } from '../../types';

const LoginForm = () => {
  const navigation = useNavigation();
  const actionData = useActionData() as HttpResponseDataObj | undefined;

  const isLoading =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    (navigation.formAction === navigation.location?.pathname ||
      navigation.formAction === navigation.location?.pathname + '?index');

  return (
    <Form
      action="/"
      method="post"
      encType="application/x-www-form-urlencoded"
      className="rounded-md"
    >
      {actionData?.message && (
        <p className="mb-5 text-red-500 text-center">{actionData.message}</p>
      )}
      <Input
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
      <Button type="submit" styleType="primary" disabled={isLoading}>
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
