import { Request } from 'express';

export interface IUser {
  displayName: string;
  username: string;
  email: string;
  profileImage: string;
  password?: string;
  passwordChangeDate: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
