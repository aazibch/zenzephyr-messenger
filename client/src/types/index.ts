export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface UserObj {
  _id: string;
  __v: number;
  displayName: string;
  username: string;
  email: string;
  profileImage: string;
}

export interface ConversationObj {
  _id: string;
  __v: number;
  participants: string[];
  startedBy: string;
  unreadBy: string;
  otherParticipant: UserObj;
  snippet?: string;
}

export interface TextContentProps {
  type: 'text';
  text: {
    content: string;
  };
}

export interface ImageContentProps {
  type: 'image';
  image: {
    url: string;
    width: number;
    height: number;
  };
}

export interface MessageObj {
  _id: string;
  __v: number;
  conversation: string;
  recipient: string;
  sender: string;
  contentProps: TextContentProps | ImageContentProps;
  createdAt: string;
  updatedAt: string;
}

export interface OptimisticMessageObj {
  sender: string;
  contentProps: TextContentProps | ImageContentProps;
}

export interface MessagesObj {
  otherParticipant: UserObj;
  messages: MessageObj[];
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
