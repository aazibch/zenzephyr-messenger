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
      },
      deletedBy: {
        $ne: req.user._id
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

export const createConversation = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const schema = conversationSchema;
    let conversation;

    const { error, value } = schema.validate(req.body);

    if (error)
      return next(
        new AppError(error.details[0].message, StatusCodes.BAD_REQUEST)
      );

    const existingConversation = await Conversation.findOne({
      participants: { $in: [req.user._id, value.recipient] }
    });

    if (!existingConversation) {
      const conversationBody = {
        participants: [req.user._id, value.recipient],
        startedBy: req.user._id,
        unreadBy: value.recipient
      };

      conversation = await Conversation.create(conversationBody);
    }

    if (
      existingConversation?.deletedBy?.toString() === req.user._id.toString()
    ) {
      conversation = await Conversation.findByIdAndUpdate(
        existingConversation._id,
        {
          $unset: {
            deletedBy: ''
          }
        },
        { new: true }
      );
    }

    if (
      existingConversation &&
      existingConversation.deletedBy?.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError(
          'A conversation with the recipient already exists',
          StatusCodes.CONFLICT
        )
      );
    }

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

// TODO: Once, messages functionality is implemented, check if deletion works as expected.
export const deleteConversation = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: {
        $in: [req.user._id]
      }
    });

    if (!conversation)
      return next(
        new AppError('Conversation not found.', StatusCodes.NOT_FOUND)
      );

    if (conversation.deletedBy && conversation.deletedBy !== req.user._id) {
      await Conversation.findByIdAndDelete(conversation._id);
      await Message.deleteMany({ conversation: conversation._id });
    } else {
      await Conversation.findByIdAndUpdate(conversation._id, {
        deletedBy: req.user._id
      });

      await Message.deleteMany({
        conversation: conversation._id,
        deletedBy: conversation.participants.find((val) => val !== req.user._id)
      });

      await Message.updateMany(
        { conversation: conversation._id },
        {
          deletedBy: req.user._id
        }
      );
    }

    res.status(StatusCodes.NO_CONTENT).send();
  }
);
