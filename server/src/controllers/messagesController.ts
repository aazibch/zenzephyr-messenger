import { Response, NextFunction } from 'express';
import catchAsync from '../middleware/catchAsync';
import Message from '../models/MessageModel';
import { AuthenticatedRequest, AuthenticatedRequestWithFile } from '../types';
import AppError from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import Conversation from '../models/ConversationModel';
import { messageSchema } from '../schemas';

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
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        messages
      }
    });
  }
);

export const createMessage = catchAsync(
  async (
    req: AuthenticatedRequestWithFile,
    res: Response,
    next: NextFunction
  ) => {
    const { conversationId } = req.params;
    const schema = messageSchema;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: {
        $in: [req.user._id]
      }
    });

    if (!conversation)
      return next(
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    const recipient = conversation.participants.find(
      (element) => element.toString() !== req.user._id.toString()
    );

    if (!req.file?.publicUrl) {
      const { error } = schema.validate(req.body);

      if (error)
        return next(
          new AppError(error.details[0].message, StatusCodes.BAD_REQUEST)
        );
    }

    let contentProps;

    if (req.file?.publicUrl) {
      contentProps = {
        type: 'image',
        image: req.file.publicUrl
      };
    } else {
      contentProps = {
        type: 'text',
        text: req.body.text
      };
    }

    const messageBody = {
      conversation: conversationId,
      recipient,
      sender: req.user._id,
      contentProps
    };

    const message = await Message.create(messageBody);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        message
      }
    });
  }
);
