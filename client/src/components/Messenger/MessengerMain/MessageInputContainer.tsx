import { useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import TextareaAutosize from 'react-textarea-autosize';
import { BsEmojiSmile, BsCardImage } from 'react-icons/bs';

import Button from '../../UI/Button';

const MessageInputContainer = () => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emojiClickHandler = (emojiData: EmojiClickData) => {
    textareaRef.current!.value = textareaRef.current!.value + emojiData.emoji;
  };

  const emojiPickerButtonHandler = () => {
    setEmojiPickerOpen((prevEmojiPickerOpen) => !prevEmojiPickerOpen);
  };

  const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('file selected', e.target.files);
  };

  return (
    <div className="p-4">
      <div className="flex items-center border rounded-lg p-1">
        <div className="relative">
          <div className="absolute z-50 bottom-14">
            {emojiPickerOpen && (
              <EmojiPicker
                skinTonesDisabled
                searchDisabled
                width="20rem"
                onEmojiClick={emojiClickHandler}
              />
            )}
          </div>
          <Button onClick={emojiPickerButtonHandler} iconButton>
            <BsEmojiSmile size="1.25rem" />
          </Button>
        </div>
        <TextareaAutosize
          name="message"
          className="resize-none outline-none flex-1 mr-1 p-3"
          ref={textareaRef}
        />
        <label
          className="text-gray-600 bg-white border-gray-300 hover:bg-[#e2e6ea] disabled:hover:bg-white rounded-full disabled:opacity-50 inline-flex px-2 py-2 cursor-pointer"
          htmlFor="image-upload"
        >
          <BsCardImage size="1.25rem" />
        </label>
        <input
          onChange={imageUploadHandler}
          className="hidden"
          type="file"
          id="image-upload"
          accept="image/png, image/gif, image/jpeg"
        />

        <Button className="h-10 border-none hover:bg-white hover:text-[#508778]">
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInputContainer;
