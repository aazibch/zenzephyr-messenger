import { Form, useNavigation } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { AuthFormComponentProps } from '../../types';

const SignupForm = ({
  formChangeHandler,
  errorMessage
}: AuthFormComponentProps) => {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    navigation.formAction === navigation.location?.pathname;

  return (
    <Form onChange={formChangeHandler} method="post" className="rounded-md">
      {errorMessage && (
        <p className="mb-5 text-red-500 text-center">{errorMessage}</p>
      )}
      <Input
        className="mb-5"
        label="Full Name"
        input={{
          id: 'fullName',
          type: 'name',
          name: 'fullName',
          autoComplete: 'on'
        }}
      />
      <Input
        className="mb-5"
        label="Username"
        input={{
          id: 'username',
          type: 'name',
          name: 'username',
          autoComplete: 'on'
        }}
      />
      <Input
        className="mb-5"
        label="Email"
        input={{
          id: 'email',
          type: 'email',
          name: 'email',
          autoComplete: 'on'
        }}
      />
      <Input
        className="mb-5"
        label="Password"
        input={{
          id: 'password',
          type: 'password',
          name: 'password',
          autoComplete: 'off'
        }}
      />
      <Input
        className="mb-5"
        label="Password Confirmation"
        input={{
          id: 'passwordConfirmation',
          type: 'password',
          name: 'passwordConfirmation',
          autoComplete: 'off'
        }}
      />
      <Button type="submit" styleType="primary" disabled={isLoading}>
        Signup
      </Button>
    </Form>
  );
};

export default SignupForm;
