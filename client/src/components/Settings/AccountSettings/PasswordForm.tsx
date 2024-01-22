import { useRef } from 'react';
import Button from '../../UI/Button';
import Input from '../../UI/Input';

interface PasswordFormProps {
  submitNewPassword: (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) => void;
  passwordFormChangeHandler: () => void;
  isLoading: boolean;
  showSuccessMessage: boolean;
  errorMessage: string | undefined;
}

const PasswordForm = ({
  submitNewPassword,
  passwordFormChangeHandler,
  isLoading,
  showSuccessMessage,
  errorMessage
}: PasswordFormProps) => {
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmationRef = useRef<HTMLInputElement>(null);

  const passwordFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewPassword(
      currentPasswordRef.current!.value,
      newPasswordRef.current!.value,
      newPasswordConfirmationRef.current!.value
    );
    currentPasswordRef.current!.value = '';
    newPasswordRef.current!.value = '';
    newPasswordConfirmationRef.current!.value = '';
  };

  return (
    <form
      onChange={passwordFormChangeHandler}
      onSubmit={passwordFormSubmitHandler}
    >
      <h3
        onSubmit={passwordFormSubmitHandler}
        className="text-lg font-semibold mb-4"
      >
        Change the Password
      </h3>
      <Input
        label="Current Password"
        ref={currentPasswordRef}
        input={{
          id: 'currentPassword',
          type: 'password',
          name: 'currentPassword'
        }}
      />
      <Input
        label="New Password"
        ref={newPasswordRef}
        input={{
          id: 'newPassword',
          type: 'password',
          name: 'newPassword'
        }}
      />
      <Input
        label="New Password Confirmation"
        className="mb-5"
        ref={newPasswordConfirmationRef}
        input={{
          id: 'newPasswordConfirmation',
          type: 'password',
          name: 'newPasswordConfirmation'
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

export default PasswordForm;
