import { json } from 'react-router-dom';

export const getTokenDuration = () => {
  const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
  const expirationDate = new Date(tokenExpirationDate!);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};

export const protectLoader = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    throw json({ message: 'Page not found.' }, { status: 404 });
  }

  return null;
};
