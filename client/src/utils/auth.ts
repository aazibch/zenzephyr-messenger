import { json } from 'react-router-dom';

export const setAuthState = (expirationDate: string) => {
  localStorage.setItem('tokenExpirationDate', expirationDate);
  localStorage.setItem('isAuth', 'true');
};

export const clearAuthState = () => {
  localStorage.removeItem('isAuth');
  localStorage.removeItem('tokenExpirationDate');
};

export const getTokenDuration = () => {
  const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
  const expirationDate = new Date(tokenExpirationDate!);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};

export const protect = () => {
  const isAuth = localStorage.getItem('isAuth');
  console.log('[protect] isAuth', isAuth);

  if (!isAuth) {
    return json({ message: 'Page not found.' }, { status: 404 });
  }

  return null;
};

export const protectLoader = () => {
  const notFoundError = protect();
  console.log('[protectLoader] notFoundError', notFoundError);

  if (notFoundError) throw notFoundError;

  return null;
};
