import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface IUser {
  _id: string | ObjectId;
  __v: number;
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  password?: string;
  passwordChangeDate: Date;
  blockedUsers: ObjectId[];
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface AuthenticatedRequestWithFile extends AuthenticatedRequest {
  file: Express.Multer.File & {
    image: {
      url: string;
      width: number;
      height: number;
    };
  };
}

// Web sockets
export interface SocketUserDataObj {
  databaseId: string;
  socketId: string;
  activeConversation: string | null;
}

export interface ServerToClientEvents {
  onlineUsers: (data: SocketUserDataObj[]) => void;
}

export interface ClientToServerEvents {
  saveUser: (data: string) => void;
}
// End of Web sockets

interface TextContentProps {
  type: 'text';
  text: {
    content: string;
  };
}

interface ImageContentProps {
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
