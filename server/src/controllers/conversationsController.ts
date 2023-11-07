import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../types';
import AppError from '../utils/AppError';
import { conversationSchema } from '../schemas';
import Conversation from '../models/ConversationModel';
import catchAsync from '../middleware/catchAsync';
import Message from '../models/MessageModel';

export const getConversations = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const conversations = await Conversation.find({
      participants: {
        $in: [req.user._id]
      }
    }).populate('participants');

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        conversations
      }
    });
  }
);

// TODO: How to populate users?

export const createConversation = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const schema = conversationSchema;

    const { error, value } = schema.validate(req.body);

    if (error)
      return next(
        new AppError(error.details[0].message, StatusCodes.BAD_REQUEST)
      );

    const existingConversation = await Conversation.findOne({
      participants: { $in: [req.user._id, value.recipient] }
    });

    if (existingConversation) {
      return next(
        new AppError(
          'A conversation with the recipient already exists',
          StatusCodes.CONFLICT
        )
      );
    }

    const conversationBody = {
      participants: [req.user._id, value.recipient],
      startedBy: req.user._id,
      unreadBy: value.recipient
    };

    const conversation = await Conversation.create(conversationBody);

    const messageBody = {
      conversation: conversation._id,
      recipient: value.recipient,
      sender: req.user._id,
      contentProps: value.contentProps
    };

    const message = await Message.create(messageBody);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        conversation,
        message
      }
    });
  }
);
