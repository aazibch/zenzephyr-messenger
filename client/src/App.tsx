import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage, { loader as rootLoader } from './pages/RootPage';
import HomePage from './pages/HomePage';
import LoginPage, { action as loginAction } from './pages/Auth/LoginPage';
import SignupPage, { action as signupAction } from './pages/Auth/SignupPage';
import { action as logoutAction } from './pages/Auth/LogoutPage';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
    action: loginAction,
    id: 'root',
    children: [
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <LoginPage />
          },
          {
            path: 'signup',
            element: <SignupPage />,
            action: signupAction
          }
        ]
      },
      { path: 'logout', action: logoutAction }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
