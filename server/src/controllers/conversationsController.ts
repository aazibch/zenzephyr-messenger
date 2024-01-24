import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  AuthenticatedRequest,
  AuthenticatedRequestWithFile,
  IUser
} from '../types';
import AppError from '../utils/AppError';
import { conversationSchema } from '../schemas';
import Conversation from '../models/ConversationModel';
import User from '../models/UserModel';
import catchAsync from '../middleware/catchAsync';
import Message from '../models/MessageModel';
import { ObjectId } from 'mongoose';

export const getConversations = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const conversations = await Conversation.find({
      participants: {
        $in: [req.user._id]
      },
      deletedBy: {
        $ne: req.user._id
      }
    }).sort('-updatedAt');

    const otherUsersIds: Promise<IUser>[] = [];

    conversations.forEach((elem) => {
      const otherUser = elem.participants.find(
        (participantId: ObjectId) =>
          participantId.toString() !== req.user._id.toString()
      );
      otherUsersIds.push(User.findById(otherUser));
    });

    const otherUsers = await Promise.all(otherUsersIds);

    const conversationsWithOtherUsers = conversations.map((elem, index) => {
      const conversation: Record<string, any> = { ...elem.toObject() };

      conversation.otherUser = otherUsers[index];
      return conversation;
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        conversations: conversationsWithOtherUsers
      }
    });
  }
);

export const createConversation = catchAsync(
  async (
    req: AuthenticatedRequestWithFile,
    res: Response,
    next: NextFunction
  ) => {
    let conversation;

    let error;

    if (!req.file?.image) {
      const result = conversationSchema.validate(req.body);

      error = result.error;
    }

    if (error)
      return next(
        new AppError(error.details[0].message, StatusCodes.BAD_REQUEST)
      );

    if (req.body.recipient === req.user._id.toString()) {
      return next(
        new AppError(
          'The recipient cannot be your own user id.',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    let recipient = await User.findById(req.body.recipient);

    if (!recipient) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user._id, req.body.recipient] },
      isBlocked: false
    });

    const blocked =
      req.user.blockedUsers.some(
        (elem) => elem.toString() === recipient._id.toString()
      ) ||
      recipient.blockedUsers.some(
        (elem) => elem.toString() === req.user._id.toString()
      );

    if (!existingConversation && !blocked) {
      const conversationBody = {
        participants: [req.user._id, req.body.recipient],
        startedBy: req.user._id,
        unreadBy: req.body.recipient
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
          'A conversation with the recipient already exists.',
          StatusCodes.CONFLICT
        )
      );
    }

    if (blocked) {
      return next(
        new AppError(
          'You cannot converse with this user.',
          StatusCodes.FORBIDDEN
        )
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
      conversation: conversation._id,
      recipient: req.body.recipient,
      sender: req.user._id,
      contentProps
    };

    const message = await Message.create(messageBody);

    const recipientConnectionsContainId = recipient.connections.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!recipientConnectionsContainId) {
      recipient = await User.findByIdAndUpdate(
        req.body.recipient,
        {
          $push: { connections: req.user._id }
        },
        { new: true }
      );
    }

    const userConnectionsContainId = req.user.connections.some(
      (id) => id.toString() === recipient._id.toString()
    );

    if (!userConnectionsContainId) {
      const authenticatedUser = await User.findByIdAndUpdate(req.user._id, {
        $push: { connections: req.body.recipient }
      });

      req.user = authenticatedUser;
    }

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        conversation,
        message
      }
    });
  }
);

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

    const recipientId = conversation.participants.find(
      (val) => val.toString() !== req.user._id.toString()
    );

    if (
      conversation.deletedBy &&
      conversation.deletedBy.toString() !== req.user._id.toString()
    ) {
      await Conversation.findByIdAndDelete(conversation._id);
      await Message.deleteMany({ conversation: conversation._id });
    } else {
      await Conversation.findByIdAndUpdate(conversation._id, {
        deletedBy: req.user._id
      });

      await Message.deleteMany({
        conversation: conversation._id,
        deletedBy: recipientId
      });

      await Message.updateMany(
        { conversation: conversation._id },
        {
          deletedBy: req.user._id
        }
      );
    }

    const authenticatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { connections: recipientId }
      },
      { new: true }
    );

    req.user = authenticatedUser;

    res.status(StatusCodes.NO_CONTENT).send();
  }
);
