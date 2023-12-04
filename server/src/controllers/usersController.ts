import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../middleware/catchAsync';
import User from '../models/UserModel';
import Conversation from '../models/ConversationModel';
import AppError from '../utils/AppError';
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

export const blockUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userToBlock = await User.findById(req.params.id);

    if (!userToBlock) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        participants: {
          $in: [req.user._id, userToBlock._id]
        }
      },
      { blockedBy: req.user._id },
      { new: true }
    );

    if (!conversation) {
      return next(
        new AppError(
          'No active conversation found between you and the user you are attempting to block.',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { blockedUsers: userToBlock._id }
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
        conversation
      }
    });
  }
);
