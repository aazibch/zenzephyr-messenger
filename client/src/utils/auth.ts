export const getTokenDuration = () => {
  const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
  console.log('[getTokenDuration] tokenExpirationDate', tokenExpirationDate);
  const expirationDate = new Date(tokenExpirationDate!);
  console.log('[getTokenDuration] expirationDate', expirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};
