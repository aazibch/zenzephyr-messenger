import { useEffect, useState, useRef } from 'react';
import {
  useLoaderData,
  useNavigation,
  useRouteLoaderData
} from 'react-router-dom';
import Message from './Message';
import { AuthObj, MessagesObj, OptimisticMessageObj } from '../../../../types';
import ImageModal from '../../../UI/Modals/ImageModal';

const ConversationMainContent = () => {
  const [maximizedImage, setMaximizedImage] = useState<string>();
  const [optimisticMessage, setOptimisticMessage] = useState<
    OptimisticMessageObj | undefined
  >();
  const auth = useRouteLoaderData('root') as AuthObj;
  const messagesData = useLoaderData() as MessagesObj;
  const messagesElementRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  // Configure optimistic UI for messages
  useEffect(() => {
    if (
      navigation.state === 'submitting' &&
      navigation.formData != null &&
      navigation.formAction === navigation.location.pathname
    ) {
      const { formData } = navigation;

      if (navigation.formMethod === 'post' && formData) {
        const image = formData.get('image') as File;
        const text = formData.get('text') as string;

        // Image message
        if (image.name !== '') {
          const file = navigation.formData?.get('image') as File;

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
                setOptimisticMessage({
                  sender: auth.user._id,
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
        }
        // Text message
        else if (text !== '') {
          setOptimisticMessage({
            sender: auth.user._id,
            contentProps: {
              type: 'text',
              text: {
                content: text
              }
            }
          });
        }
      }
    }

    if (navigation.state === 'idle') {
      setOptimisticMessage(undefined);
    }
  }, [navigation.state]);

  // Scroll to the bottom of the messages when a new message is sent.
  useEffect(() => {
    if (messagesElementRef.current) {
      messagesElementRef.current.scrollTop =
        messagesElementRef.current?.scrollHeight;
    }
  }, [messagesData]);

  const attachedImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const imageModalCloseHandler = () => {
    setMaximizedImage(undefined);
  };

  let messagesContent;

  if (messagesData.messages.length !== 0) {
    messagesContent = messagesData.messages.map((elem) => {
      return (
        <Message
          key={elem._id}
          byLoggedInUser={elem.sender.toString() === auth.user._id}
          messageContent={elem.contentProps}
          timestamp={elem.createdAt}
          attachedImageClickHandler={attachedImageClickHandler}
        />
      );
    });
  }

  return (
    <>
      {maximizedImage && (
        <ImageModal
          closeHandler={imageModalCloseHandler}
          src={maximizedImage}
        />
      )}
      <div
        ref={messagesElementRef}
        className="p-4 flex flex-col flex-grow overflow-y-auto"
      >
        {messagesContent}
        {optimisticMessage && (
          <Message
            isOptimistic
            byLoggedInUser
            messageContent={optimisticMessage.contentProps}
            timestamp="1 month ago"
          />
        )}
      </div>
    </>
  );
};

export default ConversationMainContent;
