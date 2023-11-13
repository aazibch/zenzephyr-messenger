import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface IUser {
  _id: string | ObjectId;
  __v: number;
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

export interface AuthenticatedRequestWithFile extends AuthenticatedRequest {
  file: Express.Multer.File & {
    publicUrl?: string;
  };
}
