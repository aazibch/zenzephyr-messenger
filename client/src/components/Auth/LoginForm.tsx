import { useNavigation, Form } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { AuthFormComponentProps } from '../../types';

const LoginForm = ({
  formChangeHandler,
  errorMessage
}: AuthFormComponentProps) => {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    (navigation.formAction === navigation.location?.pathname ||
      navigation.formAction === navigation.location?.pathname + '?index');

  return (
    <Form
      onChange={formChangeHandler}
      action="/"
      method="post"
      encType="application/x-www-form-urlencoded"
      className="rounded-md"
    >
      {errorMessage && (
        <p className="mb-5 text-red-500 text-center">{errorMessage}</p>
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
