import { useNavigation, useSubmit } from 'react-router-dom';
import { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BsCardImage } from 'react-icons/bs';

import Button from '../../UI/Button';
import Emojis from './Emojis';

interface MessageInputContainerProps {
  isBlocked?: boolean;
}

const MessageInputContainer = ({ isBlocked }: MessageInputContainerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    navigation.formAction === navigation.location.pathname;

  const submitForm = () => {
    const formData = new FormData();
    const image = imageInputRef.current!.files?.[0];
    const text = textareaRef.current!.value;

    if (image) {
      formData.append('image', image);
    } else if (text) {
      formData.append('text', text);
    }

    submit(formData, {
      method: 'POST'
    });
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitForm();
      textareaRef.current!.value = '';
    }
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

  let labelClassNames =
    'text-gray-600 bg-white border-gray-300 hover:bg-[#e2e6ea] disabled:hover:bg-white rounded-full disabled:opacity-50 inline-flex px-2 py-2 cursor-pointer';

  if (isSubmitting) {
    labelClassNames =
      'text-gray-600 bg-white border-gray-300 hover:bg-white rounded-full opacity-50 inline-flex px-2 py-2';
  }

  return (
    <div className="relative p-4">
      {isBlocked && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-75 z-10 flex items-center justify-center text-white">
          <p>You can't participate in this conversation.</p>
        </div>
      )}
      <form
        onSubmit={formSubmitHandler}
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        className="flex items-center border rounded-lg p-1"
      >
        <Emojis textareaRef={textareaRef} />
        <TextareaAutosize
          onKeyDown={keyDownHandler}
          name="text"
          className="resize-none outline-none flex-1 mr-1 p-3"
          ref={textareaRef}
        />
        <label className={labelClassNames} htmlFor="image-upload">
          <BsCardImage size="1.25em" />
        </label>
        <input
          id="image-upload"
          ref={imageInputRef}
          onChange={imageUploadHandler}
          className="hidden"
          type="file"
          name="image"
          disabled={isSubmitting}
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
