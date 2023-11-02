export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface UserObj {
  _id: string;
  __v: number;
  displayName: string;
  username: string;
  email: string;
  profilePhoto: URL;
}

export interface HttpResponseDataObj {
  status: number;
  statusText: 'success' | 'failure' | 'error';
  message?: string;
  data?: {
    [key: string]: any;
  };
}

export interface FormDataObj {
  [key: string]: FormDataEntryValue;
}

export interface MessengerContextObj {
  user?: UserObj | null;
  login: (user: UserObj) => void;
}

export interface AuthObj {
  status: 'AUTHENTICATED' | 'EXPIRED';
  tokenDuration: number;
  user: UserObj;
}
