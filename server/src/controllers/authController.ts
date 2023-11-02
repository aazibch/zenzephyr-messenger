import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import AppError from '../utils/AppError';
import User from '../models/UserModel';
import catchAsync from '../middleware/catchAsync';
import { signupSchema, loginSchema } from '../schemas';
import { jwtVerify } from '../utils/jwtVerify';
import { AuthenticatedRequest } from '../types';

const signToken = (id: string | ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  });
};

const createSendToken = (
  id: string | ObjectId,
  req: Request,
  res: Response
) => {
  const token = signToken(id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure,
    sameSite: 'lax'
  });

  return token;
};

const notLoggedInResponse = (next: NextFunction) => {
  next(new AppError('You are not logged in.', StatusCodes.UNAUTHORIZED));
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = signupSchema;

    const { error, value } = schema.validate(req.body);

    if (error)
      next(new AppError(error.details[0].message, StatusCodes.BAD_REQUEST));

    const filteredBody = pick({ ...value }, ['username', 'email', 'password']);

    const user = (await User.create(filteredBody)).toObject();
    delete user.password;

    const token = createSendToken(user._id, req, res);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      token,
      data: {
        user,
        auth: {
          token,
          tokenExpirationDate: new Date(
            Date.now() +
              parseInt(process.env.JWT_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000
          )
        }
      }
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = loginSchema;

    const { error, value } = schema.validate(req.body);
    const { email, password } = value;

    if (error)
      next(new AppError(error.details[0].message, StatusCodes.BAD_REQUEST));

    if (!email || !password) {
      return next(
        new AppError(
          'Please provide an email address and password.',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    let user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
      return next(
        new AppError(
          'Incorrect email address or password.',
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const token = createSendToken(user._id, req, res);

    user = user.toObject();
    delete user.password;

    res.status(StatusCodes.OK).json({
      status: 'success',
      token,
      data: {
        user,
        auth: {
          token,
          tokenExpirationDate: new Date(
            Date.now() +
              parseInt(process.env.JWT_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000
          )
        }
      }
    });
  }
);

export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    sameSite: 'strict'
  });

  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1) Getting token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return notLoggedInResponse(next);
    }

    // 2) Verfying token
    const decodedData = await jwtVerify(token, process.env.JWT_SECRET);

    // 3) Checking if user still exists.
    const user = await User.findById(decodedData.id);

    if (!user) {
      return notLoggedInResponse(next);
    }

    // 4) Checking if user changed password after token was issued.
    if (user.changedPasswordAfterToken(decodedData.iat)) {
      return notLoggedInResponse(next);
    }

    req.user = user;
    next();
  }
);
