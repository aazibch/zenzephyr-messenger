import { useNavigation, Form } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';

const LoginForm = () => {
  const navigation = useNavigation();

  const isLoading =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    (navigation.formAction === navigation.location?.pathname ||
      navigation.formAction === navigation.location?.pathname + '?index');

  return (
    <Form action="/" method="post" className="rounded-md">
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
