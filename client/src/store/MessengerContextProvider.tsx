import { ReactNode, useCallback, useReducer } from 'react';
import MessengerContext from './messenger-context';
import { UserObj } from '../types';

interface MessengerStateObj {
  user: UserObj | null;
}

interface ActionStateObj {
  type: 'LOGIN';
  payload: {
    user: UserObj;
  };
}

const defaultMessengerState = {
  user: null
};

const messengerReducer = (state: MessengerStateObj, action: ActionStateObj) => {
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user
    };
  }

  return state;
};

const MessengerContextProvider = ({ children }: { children: ReactNode }) => {
  const [messengerState, dispatchMessengerAction] = useReducer(
    messengerReducer,
    defaultMessengerState
  );

  const loginHandler = useCallback(
    (user: UserObj) => {
      dispatchMessengerAction({ type: 'LOGIN', payload: { user } });
    },
    [dispatchMessengerAction]
  );

  const messengerContext = {
    user: messengerState.user,
    login: loginHandler
  };

  return (
    <MessengerContext.Provider value={messengerContext}>
      {children}
    </MessengerContext.Provider>
  );
};

export default MessengerContextProvider;
