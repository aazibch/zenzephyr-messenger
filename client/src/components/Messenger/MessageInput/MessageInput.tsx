import {
  useLoaderData,
  useLocation,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useSearchParams,
  useSubmit
} from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BsCardImage } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';

import Button from '../../UI/Button';
import Emojis from './Emojis';
import { AuthObj, MessagesObj, OptimisticMessageObj } from '../../../types';
import MessengerContext from '../../../store/messenger-context';
import socket from '../../../services/socket';

interface MessageInputProps {
  isBlocked?: boolean;
  saveOptimisticMessage: (optimisticMessage: OptimisticMessageObj) => void;
}

const MessageInput = ({
  saveOptimisticMessage,
  isBlocked
}: MessageInputProps) => {
  const [textInput, setTextInput] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const navigation = useNavigation();
  const messagesData = useLoaderData() as MessagesObj;
  const { onlineUsers } = useContext(MessengerContext);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const user = (useRouteLoaderData('root') as AuthObj).user;

  console.log('location', location);

  const recipientId =
    messagesData?.otherParticipant?._id || searchParams.get('userId');

  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    navigation.formAction === navigation.location.pathname;

  const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  useEffect(() => {
    console.log('[MessageInput.tsx] effect function textInput', textInput);
    if (textInput.length > 0) {
      console.log('textInput', textInput);
      socket.emit('typing', {
        sender: user._id,
        recipient: recipientId,
        conversation: params.id,
        isTyping: true
      });
    } else {
      console.log('textInput', textInput);
      socket.emit('typing', {
        sender: user._id,
        recipient: recipientId,
        conversation: params.id,
        isTyping: false
      });
    }

    // return () => {
    //   socket.emit('typing', {
    //     sender: user._id,
    //     recipient: recipientId,
    //     conversation: params.id,
    //     isTyping: false
    //   });
    // };
  }, [textInput, params.id, recipientId, user._id, onlineUsers]);

  const addEmojiToInput = (emoji: string) => {
    setTextInput((prevTextInput) => prevTextInput + emoji);
  };

  const prepareOptimisticMessage = (messageContent: File | string) => {
    if (messageContent instanceof File) {
      const file = messageContent;

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
            saveOptimisticMessage({
              _id: uuidv4(),
              sender: user._id,
              contentProps: {
                type: 'image',
                image: {
                  url: imageUrl,
                  width: img.width,
                  height: img.height
                }
              }
            });
          };

          img.src = imageUrl;
        }
      };

      reader.readAsDataURL(file);
    } else if (typeof messageContent === 'string') {
      saveOptimisticMessage({
        _id: uuidv4(),
        sender: user._id,
        contentProps: {
          type: 'text',
          text: {
            content: messageContent
          }
        }
      });
    }
  };

  const submitForm = () => {
    const formData = new FormData();
    const image = imageInputRef.current!.files?.[0];
    const onlineRecipient = onlineUsers.find(
      (user) => user.databaseId === recipientId
    );

    if (location.pathname === '/messenger') {
      if (
        !onlineRecipient ||
        onlineRecipient.activeConversation !== params.id
      ) {
        formData.append('unread', 'true');
      }
    }

    if (image) {
      formData.append('image', image);
      prepareOptimisticMessage(image);
    } else if (textInput !== '') {
      formData.append('text', textInput);
      prepareOptimisticMessage(textInput);
    }

    submit(formData, {
      method: 'POST',
      encType: 'multipart/form-data'
    });
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitForm();
      setTextInput('');
    }
  };

  const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitForm();
    e.target.value = '';
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
    setTextInput('');
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
        <Emojis addEmoji={addEmojiToInput} />
        <TextareaAutosize
          onChange={inputChangeHandler}
          onKeyDown={keyDownHandler}
          value={textInput}
          name="text"
          className="resize-none outline-none flex-1 mr-1 p-3"
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
          accept="image/png, image/gif, image/jpeg"
        />
        <Button
          type="submit"
          className="h-10 border-none hover:bg-white hover:text-[#508778] disabled:hover:text-gray-600"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
