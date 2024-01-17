import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootPage, { loader as rootLoader } from './pages/RootPage';
import HomePage, { loader as homeLoader } from './pages/HomePage';
import LoginPage, { action as loginAction } from './pages/Auth/LoginPage';
import SignupPage, { action as signupAction } from './pages/Auth/SignupPage';
import NewConversationPage, {
  loader as newConversationLoader,
  action as newConversationAction
} from './pages/NewConversationPage';
import { action as logoutAction } from './pages/Auth/LogoutPage';
import ErrorPage from './pages/ErrorPage';
import { protectLoader } from './utils/auth';
import MessengerPage, {
  loader as messengerLoader,
  action as messengerAction
} from './pages/MessengerPage';
import ConversationPage, {
  loader as conversationLoader,
  action as conversationAction
} from './pages/ConversationPage';
import NoConversationPage from './pages/NoConversationPage';
import SettingsPage from './pages/SettingsPage';
import NoSettingsPage from './pages/NoSettingsPage';

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
        loader: homeLoader,
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
      {
        path: 'messenger',
        element: <MessengerPage />,
        loader: messengerLoader,
        action: messengerAction,
        id: 'messenger',
        children: [
          {
            index: true,
            element: <NoConversationPage />
          },
          {
            path: 'new',
            id: 'new-conversation',
            element: <NewConversationPage />,
            loader: newConversationLoader,
            action: newConversationAction
          },
          {
            path: ':id',
            element: <ConversationPage />,
            loader: conversationLoader,
            action: conversationAction
          }
        ]
      },
      {
        path: 'settings',
        loader: protectLoader,
        element: <SettingsPage />,
        children: [{ index: true, element: <NoSettingsPage /> }]
      },
      {
        path: 'test',
        loader: () => {
          throw new Error('Something is not right');
        }
      },
      { path: 'logout', loader: protectLoader, action: logoutAction }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
