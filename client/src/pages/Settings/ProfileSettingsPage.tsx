import { useFetcher, useRouteLoaderData } from 'react-router-dom';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import ProfileImage from '../../components/UI/ProfileImage';
import { AuthObj } from '../../types';
import { useEffect, useRef, useState } from 'react';

const ProfileSettingsPage = () => {
  const [profileImage, setProfileImage] = useState<string>();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const auth = useRouteLoaderData('root') as AuthObj;
  const user = auth?.user;
  const fetcher = useFetcher();
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const isLoading =
    fetcher.state === 'submitting' && fetcher.formAction === '/settings';

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  useEffect(() => {
    let timeoutId: number;

    if (fetcher.data?.statusText === 'success') {
      setShowSuccessMessage(true);

      timeoutId = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1500);
    }

    if (fetcher.data?.statusText === 'failure') {
      setShowSuccessMessage(false);
      setErrorMessage(fetcher.data.message);

      // timeoutId = setTimeout(() => {
      //   setErrorMessage(undefined);
      // }, 1500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetcher.data]);

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const profileImage = e.target.files?.[0];

    if (profileImage) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (
          e.target &&
          e.target.result &&
          typeof e.target.result === 'string'
        ) {
          const imageUrl: string = e.target.result;

          // Create an Image element to get image dimensions
          const img = new Image();
          img.onload = () => {
            // save to state.
            setProfileImage(imageUrl);
          };

          img.src = imageUrl;
        }
      };

      reader.readAsDataURL(profileImage);
    }
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    const profileImage = profileImageInputRef.current!.files?.[0];
    const fullName = fullNameInputRef.current!.value;

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    if (fullName !== user.fullName) {
      formData.append('fullName', fullName);
    }

    fetcher.submit(formData, {
      action: '/settings',
      method: 'PATCH',
      encType: 'multipart/form-data'
    });
  };

  const formChangeHandler = () => {
    setErrorMessage(undefined);
  };

  return (
    <div className="w-full max-w-[40rem] mx-auto mt-16">
      <form onChange={formChangeHandler} onSubmit={formSubmitHandler}>
        <div className="bg-[#f3f4f6] rounded-md p-4 mb-4 flex justify-between items-center">
          {profileImage && <ProfileImage size="large" src={profileImage} />}

          <label
            className="text-gray-600 bg-white border-gray-300 hover:bg-[#e5e5e5] disabled:hover:bg-white font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border cursor-pointer"
            htmlFor="profile-image-upload"
          >
            Change photo
          </label>
          <input
            onChange={fileInputChangeHandler}
            ref={profileImageInputRef}
            id="profile-image-upload"
            className="hidden"
            type="file"
            name="image"
            accept="image/png, image/gif, image/jpeg"
          />
        </div>
        <Input
          ref={fullNameInputRef}
          label="Full Name"
          input={{
            id: 'fullName',
            type: 'name',
            name: 'fullName',
            defaultValue: user.fullName
          }}
        />
        <Input
          className="mb-5 hover:opacity-50 cursor-not-allowed"
          inputClassName="cursor-not-allowed "
          label="Username"
          input={{
            id: 'username',
            type: 'text',
            name: 'username',
            defaultValue: user.username,
            disabled: true
          }}
          message="You cannot change the username."
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
    </div>
  );
};

export default ProfileSettingsPage;
