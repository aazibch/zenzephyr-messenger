// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import MessengerContextProvider from './store/MessengerContextProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <MessengerContextProvider>
    <App />
  </MessengerContextProvider>
  // </React.StrictMode>,
);
