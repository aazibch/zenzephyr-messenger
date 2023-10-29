import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import AppError from '../utils/AppError';
import User from '../models/UserModel';
import catchAsync from '../middleware/catchAsync';
import { generateValidationMessage } from '../utils';

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

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp(/^[a-zA-Z0-9_]*$/))
        .min(3)
        .max(50)
        .required()
        .messages({
          'string.pattern.base':
            'The username may only contain alphanumeric characters (letters A-Z, numbers 0-9) and underscores (_).',
          'string.min': generateValidationMessage('min', 'username', 3),
          'string.max': generateValidationMessage('max', 'username', 50),
          'any.required': generateValidationMessage('required', 'username')
        }),
      email: Joi.string()
        .min(5)
        .max(50)
        .email()
        .required()
        .messages({
          'string.min': generateValidationMessage('min', 'email address', 5),
          'string.max': generateValidationMessage('max', 'email address', 50),
          'string.email': generateValidationMessage('email'),
          'any.required': generateValidationMessage('required', 'email address')
        }),
      password: Joi.string()
        .min(8)
        .required()
        .messages({
          'string.min': generateValidationMessage('min', 'password', 8),
          'any.required': generateValidationMessage('required', 'password')
        }),
      passwordConfirmation: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'any.required': generateValidationMessage(
            'required',
            'password confirmation'
          ),
          'any.only': generateValidationMessage('passwordConfirmation')
        })
    });

    const { error, value } = schema.validate(req.body);

    if (error) next(new AppError(error.details[0].message, 400));

    const filteredBody = pick({ ...value }, ['username', 'email', 'password']);

    const user = (await User.create(filteredBody)).toObject();
    delete user.password;

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  }
);
