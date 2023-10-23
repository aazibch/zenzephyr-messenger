import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';

import useWhenClickedOutside from '../../hooks/useWhenClickedOutside';

type DropdownItem = {
  content: string;
  link: string;
  onClick?: () => void;
};

interface DropdownMenuProps {
  buttonContent: ReactNode;
  items: DropdownItem[];
  disableClick?: boolean;
}

const DropdownMenu = ({
  buttonContent,
  items,
  disableClick
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useWhenClickedOutside(() => {
    setIsOpen(false);
  });

  const toggleMenuHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div ref={dropdownRef} className="inline-block relative">
      <Button
        disabled={disableClick}
        isSelected={isOpen}
        iconButton
        onClick={toggleMenuHandler}
      >
        {buttonContent}
      </Button>
      {isOpen && (
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow border w-44 right-0 top-10">
          <ul className="py-2 text-sm text-gray-700">
            {items.map((item) => (
              <li
                key={item.content}
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.link ? (
                  <Link to={item.link} onClick={toggleMenuHandler}>
                    {item.content}
                  </Link>
                ) : (
                  <span
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      toggleMenuHandler();
                    }}
                  >
                    {item.content}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
