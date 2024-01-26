import { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';

import Button from '../../UI/Button';
import useWhenClickedOutside from '../../../hooks/useWhenClickedOutside';

const Emojis = ({ addEmoji }: { addEmoji: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const emojiPickerRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const emojiClickHandler = (emojiData: EmojiClickData) => {
    addEmoji(emojiData.emoji);
  };

  const emojiPickerButtonHandler = () => {
    setIsOpen((prevEmojiPickerOpen) => !prevEmojiPickerOpen);
  };

  const emojisContainerClassNames = ['absolute', 'z-50', 'bottom-14', 'hidden'];

  if (isOpen) {
    emojisContainerClassNames.splice(
      emojisContainerClassNames.indexOf('hidden'),
      1
    );
  }

  return (
    <div ref={emojiPickerRef} className="relative">
      <div className={emojisContainerClassNames.join(' ')}>
        <EmojiPicker
          skinTonesDisabled
          searchDisabled
          width="20rem"
          onEmojiClick={emojiClickHandler}
        />
      </div>
      <Button
        type="button"
        isSelected={isOpen}
        onClick={emojiPickerButtonHandler}
        iconButton
      >
        <BsEmojiSmile size="1.25em" />
      </Button>
    </div>
  );
};

export default Emojis;
