import { Response, NextFunction } from 'express';
import catchAsync from '../middleware/catchAsync';
import Message from '../models/MessageModel';
import { AuthenticatedRequest, AuthenticatedRequestWithFile } from '../types';
import AppError from '../utils/AppError';
import { StatusCodes } from 'http-status-codes';
import Conversation from '../models/ConversationModel';
import { imageMessageSchema, textMessageSchema } from '../schemas';
import { ObjectId } from 'mongoose';
import User from '../models/UserModel';

export const getMessages = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;

    let conversation = await Conversation.findById(conversationId);

    if (conversation.unreadBy?.toString() === req.user._id.toString()) {
      conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $unset: {
            unreadBy: ''
          }
        },
        { new: true }
      );
    }

    if (!conversation)
      return next(
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    const messages = await Message.find({
      conversation: conversationId,
      $or: [{ recipient: req.user._id }, { sender: req.user._id }],
      deletedBy: { $ne: req.user._id }
    });

    if (!messages)
      return next(
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    const otherUserId = conversation.participants.find(
      (participantId: ObjectId) =>
        participantId.toString() !== req.user._id.toString()
    );

    const otherUser = await User.findById(otherUserId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        otherUser: otherUser,
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
    let schema = textMessageSchema;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: {
        $in: [req.user._id]
      },
      isBlocked: false
    });

    if (!conversation)
      return next(
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    const otherUser = conversation.participants.find(
      (element) => element.toString() !== req.user._id.toString()
    );

    if (req.body.unread) {
      await Conversation.findByIdAndUpdate(conversation._id, {
        unreadBy: otherUser
      });
    }

    if (req.file?.image) {
      schema = imageMessageSchema;
    }

    const { error } = schema.validate(req.body);

    if (error) {
      return next(
        new AppError(error.details[0].message, StatusCodes.BAD_REQUEST)
      );
    }

    let contentProps;

    if (req.file?.image) {
      contentProps = {
        type: 'image',
        image: {
          url: req.file.image.url,
          width: req.file.image.width,
          height: req.file.image.height
        }
      };
    } else {
      contentProps = {
        type: 'text',
        text: {
          content: req.body.text
        }
      };
    }

    const messageBody = {
      conversation: conversationId,
      recipient: otherUser,
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
