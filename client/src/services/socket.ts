import { io } from 'socket.io-client';
import { apiUrl } from '../constants/index';

export const socket = io(apiUrl, {
  autoConnect: false
});
