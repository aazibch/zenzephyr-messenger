import { useCallback, useReducer } from 'react';
import MessengerContext from './messenger-context';
import { SocketUserDataObj } from '../types';

interface MessengerStateObj {
  onlineUsers: SocketUserDataObj[];
}

interface ActionStateObj {
  type: 'UPDATE_ONLINE_USERS';
  payload: {
    onlineUsers: SocketUserDataObj[];
  };
}

const defaultMessengerState = {
  onlineUsers: []
};

const messengerReducer = (state: MessengerStateObj, action: ActionStateObj) => {
  if (action.type === 'UPDATE_ONLINE_USERS') {
    return {
      ...state,
      onlineUsers: action.payload.onlineUsers
    };
  }

  return state;
};

const MessengerContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [messengerState, dispatchMessengerAction] = useReducer(
    messengerReducer,
    defaultMessengerState
  );

  const updateOnlineUsersHandler = useCallback(
    (onlineUsers: SocketUserDataObj[]) => {
      dispatchMessengerAction({
        type: 'UPDATE_ONLINE_USERS',
        payload: { onlineUsers }
      });
    },
    [dispatchMessengerAction]
  );

  const messengerContext = {
    onlineUsers: messengerState.onlineUsers,
    updateOnlineUsers: updateOnlineUsersHandler
  };

  return (
    <MessengerContext.Provider value={messengerContext}>
      {children}
    </MessengerContext.Provider>
  );
};

export default MessengerContextProvider;
