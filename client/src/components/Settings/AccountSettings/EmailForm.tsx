import { useRef } from 'react';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import { useRouteLoaderData } from 'react-router-dom';
import { AuthObj } from '../../../types';

interface EmailFormProps {
  submitNewEmail: (email: string) => void;
  emailFormChangeHandler: () => void;
  isLoading: boolean;
  showSuccessMessage: boolean;
  errorMessage: string | undefined;
}

const EmailForm = ({
  submitNewEmail,
  emailFormChangeHandler,
  isLoading,
  showSuccessMessage,
  errorMessage
}: EmailFormProps) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const user = (useRouteLoaderData('root') as AuthObj).authenticatedUser;

  const emailFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewEmail(emailInputRef.current!.value);
  };

  return (
    <form
      onChange={emailFormChangeHandler}
      onSubmit={emailFormSubmitHandler}
      className="mb-8"
    >
      <h3 className="text-lg font-semibold mb-4">Change the Email Address</h3>
      <Input
        label="Email"
        ref={emailInputRef}
        className="mb-5"
        input={{
          id: 'email',
          type: 'email',
          name: 'email',
          defaultValue: user.email,
          autoComplete: 'on'
        }}
      />
      <div className="flex items-center">
        <Button
          className="mr-3"
          type="submit"
          styleType="primary"
          disabled={isLoading}
        >
          Save
        </Button>
        {showSuccessMessage && (
          <p className="text-yellow-400 font-semibold">Success!</p>
        )}
        {errorMessage && (
          <p className="text-red-500 font-semibold">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};

export default EmailForm;
