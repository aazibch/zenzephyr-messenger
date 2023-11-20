import { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';

import Button from '../../../UI/Button';
import useWhenClickedOutside from '../../../../hooks/useWhenClickedOutside';

const Emojis = ({
  textareaRef
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const emojiPickerRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const emojiClickHandler = (emojiData: EmojiClickData) => {
    textareaRef.current!.value = textareaRef.current!.value + emojiData.emoji;
  };

  const emojiPickerButtonHandler = () => {
    setIsOpen((prevEmojiPickerOpen) => !prevEmojiPickerOpen);
  };

  return (
    <div ref={emojiPickerRef} className="relative">
      <div className={`absolute z-50 bottom-14 ${isOpen ? '' : 'hidden'}`}>
        <EmojiPicker
          skinTonesDisabled
          searchDisabled
          width="20rem"
          onEmojiClick={emojiClickHandler}
        />
      </div>
      <Button isSelected={isOpen} onClick={emojiPickerButtonHandler} iconButton>
        <BsEmojiSmile size="1.25em" />
      </Button>
    </div>
  );
};

export default Emojis;
