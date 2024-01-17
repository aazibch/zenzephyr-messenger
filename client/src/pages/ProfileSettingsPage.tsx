import { Form, useRouteLoaderData } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import ProfileImage from '../components/UI/ProfileImage';
import { AuthObj } from '../types';

const ProfileSettingsPage = () => {
  const user = (useRouteLoaderData('root') as AuthObj).user;

  return (
    <div className="w-full max-w-[40rem] mx-auto mt-20">
      <Form
        action="/"
        method="post"
        encType="application/x-www-form-urlencoded"
        className="rounded-md"
      >
        <div className="bg-[#f3f4f6] rounded-md p-4 mb-4 flex justify-between items-center">
          <ProfileImage size="large" src={user.profileImage} />
          <label
            className="text-gray-600 bg-white border-gray-300 hover:bg-[#e5e5e5] disabled:hover:bg-white font-inter px-4 py-2 rounded-md text-center disabled:opacity-50 border cursor-pointer"
            htmlFor="profile-image-upload"
          >
            Change photo
          </label>
          <input
            id="profile-image-upload"
            className="hidden"
            type="file"
            name="image"
            accept="image/png, image/gif, image/jpeg"
          />
          {/* <Button>Change photo</Button> */}
        </div>
        <Input
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
        <Button type="submit" styleType="primary">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default ProfileSettingsPage;
