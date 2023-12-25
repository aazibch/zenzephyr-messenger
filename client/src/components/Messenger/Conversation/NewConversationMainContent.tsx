import { useState, useEffect } from 'react';
import { useNavigation, useRouteLoaderData } from 'react-router-dom';
import { AuthObj, OptimisticMessageObj } from '../../../types';
import Message from './Message';

const NewConversationMainContent = () => {
  const [optimisticMessage, setOptimisticMessage] = useState<
    OptimisticMessageObj | undefined
  >();
  const auth = useRouteLoaderData('root') as AuthObj;
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData != null &&
    navigation.formAction ===
      navigation.location.pathname + navigation.location.search;

  useEffect(() => {
    if (isSubmitting) {
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

  return (
    <div className="p-4 flex flex-col flex-grow overflow-y-auto">
      {optimisticMessage && (
        <Message
          isOptimistic
          byLoggedInUser
          messageContent={optimisticMessage.contentProps}
        />
      )}
    </div>
  );
};

export default NewConversationMainContent;
