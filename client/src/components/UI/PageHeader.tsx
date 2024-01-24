import { IoIosArrowBack } from 'react-icons/io';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  heading: string;
  backButtonUrl?: string;
}

const PageHeader = ({ heading, backButtonUrl }: PageHeaderProps) => {
  const navigate = useNavigate();

  const backButtonClickHandler = () => {
    if (backButtonUrl) {
      navigate(backButtonUrl);
    }
  };

  return (
    <header className="flex border-b border-gray-300 h-14 shrink-0 items-center px-4">
      {backButtonUrl && (
        <Button
          onClick={backButtonClickHandler}
          iconButton
          className="mr-3 md:hidden"
        >
          <IoIosArrowBack size="1.25em" />
        </Button>
      )}

      <h2>{heading}</h2>
    </header>
  );
};

export default PageHeader;
