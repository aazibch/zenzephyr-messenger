import { useEffect, useState, useRef } from 'react';
import {
  useLoaderData,
  useNavigation,
  useParams,
  useRouteLoaderData
} from 'react-router-dom';
import Message from './Message';
import {
  AuthObj,
  MessageObj,
  MessagesObj,
  OptimisticMessageObj
} from '../../../types';
import ImageModal from '../../UI/Modals/ImageModal';
import socket from '../../../services/socket';

const ConversationContent = () => {
  const [maximizedImage, setMaximizedImage] = useState<string>();
  const [optimisticMessage, setOptimisticMessage] = useState<
    OptimisticMessageObj | undefined
  >();
  const messagesData = useLoaderData() as MessagesObj;
  const [messages, setMessages] = useState<MessageObj[]>(messagesData.messages);
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const messagesElementRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const params = useParams();

  useEffect(() => {
    if (messagesData.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  // Configure optimistic UI for messages
  useEffect(() => {
    if (
      navigation.state === 'submitting' &&
      navigation.formData != null &&
      navigation.formAction === navigation.location.pathname
    ) {
      const { formData } = navigation;

      if (navigation.formMethod === 'post' && formData) {
        const image = formData.get('image');
        const text = formData.get('text') as string | null;

        // Image message
        if (image) {
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
        }
        // Text message
        else if (text !== null) {
          setOptimisticMessage({
            sender: user._id,
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

  useEffect(() => {
    const onChatMessage = (messageData: MessageObj) => {
      if (messageData.conversation.toString() === params.id) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    };

    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

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

  if (messages.length !== 0) {
    messagesContent = messages.map((elem) => {
      return (
        <Message
          key={elem._id}
          byLoggedInUser={elem.sender.toString() === user._id}
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
          />
        )}
      </div>
    </>
  );
};

export default ConversationContent;
