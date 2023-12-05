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
      { isBlocked: true },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { blockedUsers: userToBlock._id }
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
        conversation
      }
    });
  }
);

export const unblockUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userToUnblock = await User.findById(req.params.id);

    if (!userToUnblock) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    const isBlocked = userToUnblock.blockedUsers.some(
      (elem) => elem.toString() === req.user._id.toString()
    );

    const conversation = await Conversation.findOneAndUpdate(
      {
        participants: {
          $in: [req.user._id, userToUnblock._id]
        }
      },
      { isBlocked },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { blockedUsers: userToUnblock._id }
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
        conversation
      }
    });
  }
);
