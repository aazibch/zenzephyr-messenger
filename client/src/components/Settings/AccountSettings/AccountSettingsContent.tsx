import { useEffect, useState } from 'react';
import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';
import { useFetcher, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, HttpResponseDataObj } from '../../../types';

const AccountSettingsContent = () => {
  const [responseData, setResponseData] = useState<HttpResponseDataObj>();
  const [submittedEmailForm, setSubmittedEmailForm] = useState<boolean>(false);
  const [submittedPasswordForm, setSubmittedPasswordForm] =
    useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
  const user = (useRouteLoaderData('root') as AuthObj).authenticatedUser;
  const fetcher = useFetcher();

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/settings';

  useEffect(() => {
    if (fetcher.data?.statusText === 'success') {
      setResponseData(fetcher.data);
    }

    if (fetcher.data?.statusText === 'failure') {
      if (submittedEmailForm) {
        setEmailErrorMessage(fetcher.data.message);
        setSubmittedEmailForm(false);
      }

      if (submittedPasswordForm) {
        setPasswordErrorMessage(fetcher.data.message);
        setSubmittedPasswordForm(false);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    let timeoutId: number;

    if (submittedEmailForm || submittedPasswordForm) {
      if (responseData) {
        if (submittedEmailForm) {
          setEmailErrorMessage(undefined);
        }

        if (submittedPasswordForm) {
          setPasswordErrorMessage(undefined);
        }

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

  const submitNewEmail = (email: string) => {
    const formData = new FormData();

    if (email !== user.email) {
      formData.append('email', email);
    }

    fetcher.submit(formData, {
      action: '/settings',
      method: 'PATCH',
      encType: 'multipart/form-data'
    });

    setSubmittedPasswordForm(false);
    setSubmittedEmailForm(true);
  };

  const submitNewPassword = (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) => {
    const formData = new FormData();

    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);
    formData.append('newPasswordConfirmation', newPasswordConfirmation);

    fetcher.submit(formData, {
      action: '/settings',
      method: 'PATCH',
      encType: 'multipart/form-data'
    });

    setSubmittedEmailForm(false);
    setSubmittedPasswordForm(true);
  };

  const emailFormChangeHandler = () => {
    setEmailErrorMessage(undefined);
  };

  const passwordFormChangeHandler = () => {
    setPasswordErrorMessage(undefined);
  };

  return (
    <div className="flex flex-col grow overflow-y-auto">
      <div className="w-full max-w-[40rem] mx-auto my-16 p-4">
        <EmailForm
          showSuccessMessage={showSuccessMessage && submittedEmailForm}
          errorMessage={emailErrorMessage}
          isLoading={isLoading}
          submitNewEmail={submitNewEmail}
          emailFormChangeHandler={emailFormChangeHandler}
        />
        <PasswordForm
          showSuccessMessage={showSuccessMessage && submittedPasswordForm}
          errorMessage={passwordErrorMessage}
          isLoading={isLoading}
          submitNewPassword={submitNewPassword}
          passwordFormChangeHandler={passwordFormChangeHandler}
        />
      </div>
    </div>
  );
};

export default AccountSettingsContent;
