import { useEffect, useState, useRef } from 'react';
import {
  useLoaderData,
  // useNavigation,
  useParams,
  useRevalidator,
  useRouteLoaderData
} from 'react-router-dom';
import Message from './Message';
import {
  AuthObj,
  MessageObj,
  MessagesObj,
  OptimisticMessageObj
  // OptimisticMessageObj
} from '../../../types';
import ImageModal from '../../UI/Modals/ImageModal';
import socket from '../../../services/socket';
import TypingIndicator from './TypingIndicator';

interface ConversationContentProps {
  optimisticMessages: OptimisticMessageObj[];
}

const ConversationContent = ({
  optimisticMessages
}: ConversationContentProps) => {
  const [maximizedImage, setMaximizedImage] = useState<string>();
  // const [optimisticMessage, setOptimisticMessage] = useState<
  //   OptimisticMessageObj | undefined
  // >();
  const messagesData = useLoaderData() as MessagesObj;
  const { messages: messagesFromLoader } = messagesData;
  const [messages, setMessages] = useState<MessageObj[]>(messagesData.messages);
  const [isRecipientTyping, setIsRecipientTyping] = useState<boolean>(false);
  const [isInitiallyScrolled, setIsInitiallyScrolled] =
    useState<boolean>(false);
  const [wasScrolledToBottom, setWasScrolledToBottom] =
    useState<boolean>(false);
  const user = (useRouteLoaderData('root') as AuthObj).user;
  const messagesElementRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const revalidator = useRevalidator();
  const paramsRef = useRef(params.id);

  useEffect(() => {
    const onTypingStatus = (typingStatus: boolean) => {
      setIsRecipientTyping(typingStatus);
    };

    socket.on('typingStatus', onTypingStatus);

    return () => {
      setIsRecipientTyping(false);
      socket.off('typingStatus', onTypingStatus);
    };
  }, [paramsRef.current]);

  useEffect(() => {
    // Update the ref when params.id changes
    paramsRef.current = params.id;
  }, [params.id]);

  useEffect(() => {
    if (messagesFromLoader) {
      setMessages(messagesFromLoader);
    }
  }, [messagesFromLoader]);

  // const isSubmitting =
  //   navigation.state === 'submitting' &&
  //   navigation.formData != null &&
  //   navigation.formAction === navigation.location.pathname;

  // const { state } = navigation;

  // // Configure optimistic UI for messages
  // useEffect(() => {
  //   if (isSubmitting) {
  //     const { formData } = navigation;

  //     if (navigation.formMethod === 'post' && formData) {
  //       const image = formData.get('image');
  //       const text = formData.get('text') as string | null;

  //       // Image message
  //       if (image) {
  //         const file = navigation.formData?.get('image') as File;

  //         const reader = new FileReader();

  //         reader.onload = (e: ProgressEvent<FileReader>) => {
  //           if (
  //             e.target &&
  //             e.target.result &&
  //             typeof e.target.result === 'string'
  //           ) {
  //             const imageUrl: string = e.target.result;

  //             // Create an Image element to get image dimensions
  //             const img = new Image();
  //             img.onload = () => {
  //               setOptimisticMessage({
  //                 sender: user._id,
  //                 contentProps: {
  //                   type: 'image',
  //                   image: {
  //                     url: imageUrl,
  //                     width: img.width,
  //                     height: img.height
  //                   }
  //                 }
  //               });
  //             };

  //             img.src = imageUrl;
  //           }
  //         };

  //         reader.readAsDataURL(file);
  //       }
  //       // Text message
  //       else if (text !== null) {
  //         setOptimisticMessage({
  //           sender: user._id,
  //           contentProps: {
  //             type: 'text',
  //             text: {
  //               content: text
  //             }
  //           }
  //         });
  //       }
  //     }
  //   }

  //   if (state === 'idle') {
  //     setOptimisticMessage(undefined);
  //   }
  // }, [isSubmitting, state]);

  useEffect(() => {
    const onChatMessage = () => {
      // if (messageData.conversation === paramsRef.current) {
      //   setMessages((prevMessages) => [...prevMessages, messageData]);
      // }

      if (revalidator.state === 'idle') {
        revalidator.revalidate();
      }
    };

    socket.on('chatMessage', onChatMessage);

    return () => {
      socket.off('chatMessage', onChatMessage);
    };
  }, []);

  // Scroll to the bottom of the messages when a new message is sent.
  // TODO: Come back!
  useEffect(() => {
    const scrollToBottom = () => {
      messagesElementRef.current!.scrollTop =
        messagesElementRef.current!.scrollHeight;
    };

    if (messagesElementRef.current) {
      if (!isInitiallyScrolled) {
        // const isBottom =
        // messagesElementRef.current.scrollHeight -
        //   messagesElementRef.current.scrollTop ===
        // messagesElementRef.current.clientHeight;

        scrollToBottom();
        setWasScrolledToBottom(true);
        setIsInitiallyScrolled(true);
        // if (!isInitiallyScrolled || isBottom) {
        //   scrollToBottom();
        //   setWasScrolledToBottom(true);

        //   if (!isInitiallyScrolled) {
        //     setIsInitiallyScrolled(true);
        //   }
        // }
      } else if (wasScrolledToBottom) {
        scrollToBottom();
      }
    }

    // if (!isProgrammaticallyScrolled) {
    //   scrollToBottom();
    //   setIsProgrammaticallyScrolled(true);
    // }
  }, [
    messagesElementRef.current,
    messagesData,
    optimisticMessages,
    isInitiallyScrolled,
    wasScrolledToBottom
  ]);

  const attachedImageClickHandler = (imageSource: string) => {
    setMaximizedImage(imageSource);
  };

  const imageModalCloseHandler = () => {
    setMaximizedImage(undefined);
  };

  const scrollHandler = () => {
    if (isInitiallyScrolled) {
      const isBottom =
        messagesElementRef.current!.scrollHeight -
          messagesElementRef.current!.scrollTop ===
        messagesElementRef.current!.clientHeight;

      setWasScrolledToBottom(isBottom);
    }
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

  const optimisticMessagesElements = optimisticMessages.map((elem) => {
    return (
      <Message
        key={elem._id}
        isOptimistic
        byLoggedInUser
        messageContent={elem.contentProps}
      />
    );
  });

  return (
    <>
      {maximizedImage && (
        <ImageModal
          closeHandler={imageModalCloseHandler}
          src={maximizedImage}
        />
      )}
      <div
        onScroll={scrollHandler}
        ref={messagesElementRef}
        className="p-4 flex flex-col flex-grow overflow-y-auto"
      >
        {messagesContent}
        {/* {optimisticMessage && (
          <Message
            isOptimistic
            byLoggedInUser
            messageContent={optimisticMessage.contentProps}
          />
        )} */}
        {optimisticMessagesElements}
        {isRecipientTyping && <TypingIndicator />}
      </div>
    </>
  );
};

export default ConversationContent;
