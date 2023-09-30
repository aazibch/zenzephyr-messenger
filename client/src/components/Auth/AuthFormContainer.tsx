import Button from '../UI/Button';
import LoginForm from './LoginForm';
import styles from './AuthFormContainer.module.css';

const AuthFormContainer = () => {
  return (
    <div className="border rounded-md border-gray-300 p-10 basis-[30rem] shadow-xl">
      <LoginForm />
      <div className="mt-5">
        <p className={`${styles.signupMessage} text-gray-500 text-sm mb-5`}>
          Don't have an account?
        </p>
        <Button className="block w-full">Signup</Button>
      </div>
    </div>
  );
};

export default AuthFormContainer;
