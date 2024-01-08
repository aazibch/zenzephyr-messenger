import { io } from 'socket.io-client';
import { socketUrl } from '../constants/index';
import { SocketUserDataObj } from '../types';

export let onlineUsers: SocketUserDataObj[] = [];

export const updateOnlineUsers = (updatedOnlineUsers: SocketUserDataObj[]) => {
  onlineUsers = updatedOnlineUsers;
};

const socket = io(socketUrl, {
  autoConnect: false
});

export default socket;
