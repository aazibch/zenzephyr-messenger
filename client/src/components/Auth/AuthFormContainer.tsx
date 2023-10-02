import LinkButton from '../UI/LinkButton';
import styles from './AuthFormContainer.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthFormContainer = ({ mode }: { mode: 'login' | 'signup' }) => {
  return (
    <div className="border rounded-md border-gray-300 p-10 basis-[30rem] shadow-xl">
      {mode === 'login' ? <LoginForm /> : <SignupForm />}
      <div className="mt-5">
        <p className={`${styles.signupMessage} text-gray-500 text-sm mb-5`}>
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
        </p>
        {mode === 'login' ? (
          <LinkButton className="block w-full" to="/signup">
            Signup Instead
          </LinkButton>
        ) : (
          <LinkButton className="block w-full" to="/">
            Login Instead
          </LinkButton>
        )}
      </div>
    </div>
  );
};

export default AuthFormContainer;
