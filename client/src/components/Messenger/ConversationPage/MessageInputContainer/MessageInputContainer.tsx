import { useNavigation, useSubmit } from 'react-router-dom';
import { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BsCardImage } from 'react-icons/bs';

import Button from '../../../UI/Button';
import Emojis from './Emojis';

const MessageInputContainer = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === 'submitting' ||
    (navigation.state === 'loading' &&
      navigation.formData != null &&
      navigation.formAction === navigation.location.pathname);

  const submitForm = () => {
    submit(formRef.current, {
      method: 'POST',
      encType: 'multipart/form-data'
    });
  };

  const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitForm();
    e.target.value = '';
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
    textareaRef.current!.value = '';
  };

  return (
    <div className="p-4">
      <form
        onSubmit={formSubmitHandler}
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        className="flex items-center border rounded-lg p-1"
      >
        <Emojis textareaRef={textareaRef} />
        <TextareaAutosize
          name="text"
          className="resize-none outline-none flex-1 mr-1 p-3"
          ref={textareaRef}
        />
        <label
          className="text-gray-600 bg-white border-gray-300 hover:bg-[#e2e6ea] disabled:hover:bg-white rounded-full disabled:opacity-50 inline-flex px-2 py-2 cursor-pointer"
          htmlFor="image-upload"
        >
          <BsCardImage size="1.25em" />
        </label>
        <input
          id="image-upload"
          ref={imageInputRef}
          onChange={imageUploadHandler}
          className="hidden"
          type="file"
          name="image"
          accept="image/png, image/gif, image/jpeg"
        />

        <Button
          type="submit"
          className="h-10 border-none hover:bg-white hover:text-[#508778] disabled:hover:text-gray-600"
          disabled={isSubmitting}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageInputContainer;
