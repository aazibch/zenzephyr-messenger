import { io } from 'socket.io-client';
import { apiUrl } from '../constants/index';

const socket = io(apiUrl, {
  autoConnect: false
});

export default socket;
