import { Request, Response, NextFunction } from 'express';
import catchAsync from '../middleware/catchAsync';
import User from '../models/UserModel';
import AppError from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../types';

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user
      }
    });
  }
);

export const getMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user
      }
    });
  }
);
