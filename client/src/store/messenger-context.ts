import { createContext } from 'react';
import { MessengerContextObj } from '../types';

const MessengerContext = createContext<MessengerContextObj>({
  onlineUsers: [],
  updateOnlineUsers: () => {}
});

export default MessengerContext;
