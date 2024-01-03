import { io } from 'socket.io-client';
import { apiUrl } from '../constants/index';
import { SocketUserDataObj } from '../types';

export let onlineUsers: SocketUserDataObj[] = [];

export const updateOnlineUsers = (updatedOnlineUsers: SocketUserDataObj[]) => {
  onlineUsers = updatedOnlineUsers;
};

const socket = io(apiUrl, {
  autoConnect: false
});

export default socket;
