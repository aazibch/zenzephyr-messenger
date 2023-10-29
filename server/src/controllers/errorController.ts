import { MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { startCase } from 'lodash';
import AppError from '../utils/AppError';

const getDublicateFieldError = (err: MongooseError) => {
  if ('keyPattern' in err && Object.keys(err.keyPattern)[0]) {
    let field = startCase(Object.keys(err.keyPattern)[0]);
    const message = `Duplicate value for the "${field}" property.`;
    return new AppError(message, 400);
  }
};

const getDublicateFieldErrorForEmail = () => {
  const message = 'An account with the same email address already exists.';
  return new AppError(message, 400);
};

const getDublicateFieldErrorForUsername = () => {
  const message = 'An account with the same username already exists.';
  return new AppError(message, 400);
};

const sendError = (err: AppError, req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('error', err);
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong.'
  });
};

const handleError = (
  err: AppError | MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { originalUrl } = req;

  if ('code' in err && err.code === 11000) {
    if (originalUrl === '/api/v1/users/signup') {
      if ('keyPattern' in err && Object.keys(err.keyPattern)[0] === 'email') {
        err = getDublicateFieldErrorForEmail();
      } else if (
        'keyPattern' in err &&
        Object.keys(err.keyPattern)[0] === 'username'
      ) {
        err = getDublicateFieldErrorForUsername();
      }
    } else {
      err = getDublicateFieldError(err as MongooseError);
    }
  }

  sendError(err as AppError, req, res);
};

//TODO: Is looking for JWT errors necessary?

export default handleError;
