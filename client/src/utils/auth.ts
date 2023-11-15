import { json } from 'react-router-dom';

export const getTokenDuration = () => {
  const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
  const expirationDate = new Date(tokenExpirationDate!);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};

export const protect = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    return json({ message: 'Page not found.' }, { status: 404 });
  }

  return null;
};

export const protectLoader = () => {
  const notFoundError = protect();

  if (notFoundError) throw notFoundError;

  return null;
};
