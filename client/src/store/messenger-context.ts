import { createContext } from 'react';
import { MessengerContextObj } from '../types';

const MessengerContext = createContext<MessengerContextObj>({
  user: null,
  login: () => {}
});

export default MessengerContext;
