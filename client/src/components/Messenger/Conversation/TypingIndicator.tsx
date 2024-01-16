import { PulseLoader } from 'react-spinners';

const TypingIndicator = () => {
  return (
    <div className="mt-auto">
      <PulseLoader className="mt-2" size="0.3rem" color="#8C8C8C" />
    </div>
  );
};

export default TypingIndicator;
