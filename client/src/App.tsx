import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage from './pages/RootPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

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
            element: <LoginPage />
          },
          { path: 'signup', element: <SignupPage /> }
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
