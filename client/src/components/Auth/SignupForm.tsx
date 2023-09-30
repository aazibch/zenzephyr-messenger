import Input from '../UI/Input';
import Button from '../UI/Button';

const SignupForm = () => {
  return (
    <form className="rounded-md">
      <Input
        className="mb-5"
        label="Username"
        input={{
          id: 'username',
          type: 'name'
        }}
      />
      <Input
        className="mb-5"
        label="Email"
        input={{
          id: 'email',
          type: 'email'
        }}
      />
      <Input
        className="mb-5"
        label="Password"
        input={{
          id: 'password',
          type: 'password'
        }}
      />
      <Input
        className="mb-5"
        label="Password Confirmation"
        input={{
          id: 'passwordConfirmation',
          type: 'password'
        }}
      />
      <Button type="submit" styleType="primary">
        Signup
      </Button>
    </form>
  );
};

export default SignupForm;
