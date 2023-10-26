import { useContext, useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage, { loader as rootLoader } from './pages/RootPage';
import HomePage from './pages/HomePage';
import LoginPage, { action as loginAction } from './pages/Auth/LoginPage';
import SignupPage, { action as signupAction } from './pages/Auth/SignupPage';
import MessengerContext from './store/messenger-context';
import ErrorPage from './pages/ErrorPage';

function App() {
  const messengerCtx = useContext(MessengerContext);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootPage />,
          loader: rootLoader,
          errorElement: <ErrorPage />,
          action: loginAction(messengerCtx),
          shouldRevalidate: () => false,
          children: [
            {
              path: '',
              element: <HomePage />,
              loader: () => {
                console.log('home page loader');
                return null;
              },
              children: [
                {
                  index: true,
                  element: <LoginPage />
                },
                {
                  path: 'signup',
                  element: <SignupPage />,
                  action: signupAction(messengerCtx)
                }
              ]
            }
          ]
        }
      ]),
    []
  );

  return <RouterProvider router={router} />;
}

export default App;
