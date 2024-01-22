import { useEffect, useState } from 'react';
import LinkButton from '../UI/LinkButton';
import styles from './AuthFormContainer.module.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useActionData } from 'react-router-dom';
import { HttpResponseDataObj } from '../../types';

const AuthFormContainer = ({ mode }: { mode: 'login' | 'signup' }) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const actionData = useActionData() as HttpResponseDataObj | undefined;

  useEffect(() => {
    setErrorMessage(undefined);
  }, [mode]);

  useEffect(() => {
    if (actionData?.statusText === 'failure') {
      setErrorMessage(actionData.message);
    }
  }, [actionData]);

  const formChangeHandler = () => {
    setErrorMessage(undefined);
  };

  return (
    <div className="border rounded-md border-gray-300 p-10 basis-[30rem] shadow-xl">
      {mode === 'login' ? (
        <LoginForm
          formChangeHandler={formChangeHandler}
          errorMessage={errorMessage}
        />
      ) : (
        <SignupForm
          formChangeHandler={formChangeHandler}
          errorMessage={errorMessage}
        />
      )}
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
