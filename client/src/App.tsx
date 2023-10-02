import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage from './pages/RootPage';
import HomePage from './pages/HomePage';
import LoginPage, { action as loginAction } from './pages/Auth/LoginPage';
import SignupPage, { action as signupAction } from './pages/Auth/SignupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <LoginPage />,
            action: loginAction
          },
          {
            path: 'signup',
            element: <SignupPage />,
            action: signupAction
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
