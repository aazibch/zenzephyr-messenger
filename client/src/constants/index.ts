let apiUrl = 'http://localhost:8080';
let socketUrl = 'ws://localhost:8080';
let clientUrl = 'http://localhost:5173';

if (import.meta.env.VITE_NODE_ENV !== 'development') {
  apiUrl = 'https://zephyr-messenger-api.onrender.com';
  socketUrl = 'wss://zephyr-messenger-api.onrender.com';
  clientUrl = 'https://zephyr-messenger.onrender.com';
}

export { apiUrl, clientUrl, socketUrl };
