import { useEffect, useState, useRef, useCallback } from 'react';
import { useLoaderData, useParams, useRouteLoaderData } from 'react-router-dom';
import Message from './Message';
import { AuthObj, MessagesObj, OptimisticMessageObj } from '../../../types';
import ImageModal from '../../UI/Modals/ImageModal';
import socket from '../../../services/socket';
import TypingIndicator from './TypingIndicator';

interface ConversationContentProps {
  optimisticMessages: OptimisticMessageObj[];
}

const getTimeDifference = (
  currentTimestamp: string,
  previousTimestamp: string
): number => {
  const current = new Date(currentTimestamp).getTime();
  const previous = new Date(previousTimestamp).getTime();
  return current - previous;
};

const ConversationContent = ({
  optimisticMessages
}: ConversationContentProps) => {
  const [maximizedImage, setMaximizedImage] = useState<string>();
  const messages = (useLoaderData() as MessagesObj).messages;
  const [isRecipientTyping, setIsRecipientTyping] = useState<boolean>(false);
  const [isInitiallyScrolled, setIsInitiallyScrolled] =
    useState<boolean>(false);
  const [wasScrolledToBottom, setWasScrolledToBottom] =
    useState<boolean>(false);
  const user = (useRouteLoaderData('root') as AuthObj).authenticatedUser;
  const messagesElementRef = useRef<HTMLDivElement>(null);
  const params = useParams();
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

  const scrollToBottom = useCallback(() => {
    messagesElementRef.current!.scrollTop =
      messagesElementRef.current!.scrollHeight;
  }, [messagesElementRef.current]);

  // Scroll to the bottom of the messages when a new message is sent.
  useEffect(() => {
    if (messagesElementRef.current) {
      if (!isInitiallyScrolled) {
        scrollToBottom();
        setWasScrolledToBottom(true);
        setIsInitiallyScrolled(true);
      } else if (wasScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [
    messagesElementRef.current,
    scrollToBottom,
    messages,
    optimisticMessages,
    isInitiallyScrolled,
    wasScrolledToBottom
  ]);

  useEffect(() => {
    if (isInitiallyScrolled && isRecipientTyping && wasScrolledToBottom) {
      scrollToBottom();
    }
  }, [
    scrollToBottom,
    isInitiallyScrolled,
    isRecipientTyping,
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
    messagesContent = messages.map((elem, index) => {
      if (
        index === 0 ||
        getTimeDifference(elem.createdAt, messages[index - 1].createdAt) <
          60000 ||
        index === messages.length - 1
      ) {
        return (
          <Message
            key={elem._id}
            byLoggedInUser={elem.sender.toString() === user._id}
            messageContent={elem.contentProps}
            timestamp={elem.createdAt}
            attachedImageClickHandler={attachedImageClickHandler}
          />
        );
      } else {
        return (
          <Message
            key={elem._id}
            byLoggedInUser={elem.sender.toString() === user._id}
            messageContent={elem.contentProps}
            attachedImageClickHandler={attachedImageClickHandler}
          />
        );
      }
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
        {optimisticMessagesElements}
        {isRecipientTyping && <TypingIndicator />}
      </div>
    </>
  );
};

export default ConversationContent;
