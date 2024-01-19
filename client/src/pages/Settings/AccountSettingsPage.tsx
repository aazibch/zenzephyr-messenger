import { useFetcher, useRouteLoaderData } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { AuthObj, HttpResponseDataObj } from '../../types';
import { useEffect, useRef, useState } from 'react';

const AccountSettingsPage = () => {
  const [responseData, setResponseData] = useState<HttpResponseDataObj>();
  const [submittedEmailForm, setSubmittedEmailForm] = useState<boolean>(false);
  const [submittedPasswordForm, setSubmittedPasswordForm] =
    useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const fetcher = useFetcher();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmationRef = useRef<HTMLInputElement>(null);

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/settings';

  useEffect(() => {
    if (fetcher.data?.statusText === 'success') {
      setResponseData(fetcher.data);
    }
  }, [fetcher.data]);

  useEffect(() => {
    let timeoutId: number;

    if (submittedEmailForm || submittedPasswordForm) {
      if (responseData) {
        setShowSuccessMessage(true);

        timeoutId = setTimeout(() => {
          setShowSuccessMessage(false);

          if (submittedEmailForm) {
            setSubmittedEmailForm(false);
          }

          if (submittedPasswordForm) {
            setSubmittedPasswordForm(false);
          }

          setResponseData(undefined);
        }, 1500);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [submittedEmailForm, submittedPasswordForm, responseData]);

  const emailFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    const email = emailInputRef.current!.value;

    if (email !== user.fullName) {
      formData.append('email', email);
    }

    fetcher.submit(formData, {
      action: '/settings',
      method: 'PATCH',
      encType: 'multipart/form-data'
    });

    setSubmittedEmailForm(true);
  };

  const passwordFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    const currentPassword = currentPasswordRef.current!.value;
    const password = newPasswordRef.current!.value;
    const passwordConfirmation = newPasswordConfirmationRef.current!.value;

    formData.append('currentPassword', currentPassword);
    formData.append('password', password);
    formData.append('passwordConfirmation', passwordConfirmation);

    fetcher.submit(formData, {
      action: '/settings',
      method: 'PATCH',
      encType: 'multipart/form-data'
    });

    currentPasswordRef.current!.value = '';
    newPasswordRef.current!.value = '';
    newPasswordConfirmationRef.current!.value = '';

    setSubmittedPasswordForm(true);
  };

  return (
    <div className="w-full max-w-[40rem] mx-auto mt-16">
      <form onSubmit={emailFormSubmitHandler} className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Change the Email Address</h3>
        <Input
          label="Email"
          ref={emailInputRef}
          className="mb-5"
          input={{
            id: 'email',
            type: 'email',
            name: 'email',
            defaultValue: user.email
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
          {showSuccessMessage && submittedEmailForm && (
            <p className="text-yellow-400 font-semibold">Success!</p>
          )}
        </div>
      </form>
      <form onSubmit={passwordFormSubmitHandler}>
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
            name: 'password'
          }}
        />
        <Input
          label="New Password Confirmation"
          className="mb-5"
          ref={newPasswordConfirmationRef}
          input={{
            id: 'newPasswordConfirmation',
            type: 'password',
            name: 'passwordConfirmation'
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
          {showSuccessMessage && submittedPasswordForm && (
            <p className="text-yellow-400 font-semibold">Success!</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsPage;
