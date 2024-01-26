let clientUrl = 'http://localhost:5173';

if (process.env.NODE_ENV !== 'development') {
  clientUrl = 'https://zephyr-messenger.onrender.com';
}

export { clientUrl };
