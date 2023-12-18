import { IoClose } from 'react-icons/io5';
import Button from '../Button';
import Modal from './Modal';
// import Backdrop from './Backdrop';

const DialogModal = ({
  heading,
  textBody,
  isLoading,
  dismissHandler,
  confirmHandler
}: {
  heading: string;
  textBody: string;
  isLoading: boolean;
  dismissHandler: () => void;
  confirmHandler: () => void;
}) => {
  return (
    <Modal.Body dismissHandler={dismissHandler}>
      <Modal.Header>
        <h3 className="text-xl font-semibold ">{heading}</h3>
        <Button
          iconButton
          onClick={dismissHandler}
          className="text-lg s-auto justify-center items-center"
        >
          <IoClose />
        </Button>
      </Modal.Header>
      <Modal.Content>
        <p className="text-base leading-relaxed text-gray-500 ">{textBody}</p>
      </Modal.Content>
      <Modal.Footer>
        <Button
          styleType="primary"
          onClick={confirmHandler}
          className="mr-1"
          disabled={isLoading}
        >
          Confirm
        </Button>
        <Button onClick={dismissHandler}>Cancel</Button>
      </Modal.Footer>
    </Modal.Body>
  );
};

export default DialogModal;
