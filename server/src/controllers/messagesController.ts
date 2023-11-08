import { Response, NextFunction } from 'express';
import catchAsync from '../middleware/catchAsync';
import Message from '../models/MessageModel';
import { AuthenticatedRequest } from '../types';
import AppError from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';

export const getMessages = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
      $or: [{ recipient: req.user._id }, { sender: req.user._id }],
      deletedBy: { $ne: req.user._id }
    });

    if (!messages)
      return next(
        new AppError('Conversation not found', StatusCodes.NOT_FOUND)
      );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        messages
      }
    });
  }
);
