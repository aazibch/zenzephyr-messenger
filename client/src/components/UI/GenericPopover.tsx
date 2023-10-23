import { ReactNode, useState } from 'react';
import useWhenClickedOutside from '../../hooks/useWhenClickedOutside';

import Button from './Button';

interface GenericPopoverProps {
  buttonContent: ReactNode;
  popoverElement: ReactNode;
  disableClick?: boolean;
}

const GenericPopover = ({
  buttonContent,
  popoverElement,
  disableClick
}: GenericPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const popoverRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const togglePopoverHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div ref={popoverRef} className="inline-block relative">
      <Button
        disabled={disableClick}
        isSelected={isOpen}
        iconButton
        onClick={togglePopoverHandler}
      >
        {buttonContent}
      </Button>
      {isOpen && popoverElement}
    </div>
  );
};

export default GenericPopover;
