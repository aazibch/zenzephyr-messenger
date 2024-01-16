import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../middleware/catchAsync';
import User from '../models/UserModel';
import Conversation from '../models/ConversationModel';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../types';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const sendUserNotFoundResponse = (res: Response) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user: null
    }
  });
};

export const getUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { usernameOrId } = req.params;
    const isValidMongoId = ObjectId.isValid(usernameOrId);
    let userConditions: Record<string, any> = {
      $or: [{ username: usernameOrId }, { _id: usernameOrId }]
    };

    if (!isValidMongoId) {
      userConditions = {
        username: usernameOrId
      };
    }

    const user = await User.findOne(userConditions);

    if (!user) {
      return sendUserNotFoundResponse(res);
    }

    if (user._id.toString() === req.user._id.toString()) {
      return sendUserNotFoundResponse(res);
    }

    let isBlocked = req.user.blockedUsers.find(
      (elem) => elem.toString() === user._id.toString()
    );

    if (isBlocked) {
      sendUserNotFoundResponse(res);
    }

    isBlocked = user.blockedUsers.find(
      (elem) => elem.toString() === req.user._id.toString()
    );

    if (isBlocked) {
      return sendUserNotFoundResponse(res);
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [user._id, req.user._id] },
      deletedBy: { $ne: req.user._id }
    });

    if (conversation) {
      return sendUserNotFoundResponse(res);
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
    const userToBlock = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { connections: req.user._id }
      },
      { new: true }
    );

    if (!userToBlock) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        participants: {
          $all: [req.user._id, userToBlock._id]
        }
      },
      { isBlocked: true },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { blockedUsers: userToBlock._id },
        $pull: { connections: userToBlock._id }
      },
      { new: true }
    );

    req.user = user;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: user,
        recipientUser: userToBlock,
        conversation
      }
    });
  }
);

export const unblockUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let userToUnblock = await User.findById(req.params.id);

    if (!userToUnblock) {
      return next(new AppError('User not found.', StatusCodes.NOT_FOUND));
    }

    const isBlocked = userToUnblock.blockedUsers.some(
      (elem) => elem.toString() === req.user._id.toString()
    );

    const conversation = await Conversation.findOneAndUpdate(
      {
        participants: {
          $all: [req.user._id, userToUnblock._id]
        }
      },
      { isBlocked },
      { new: true }
    );

    const userToUnblockUpdates: Record<string, any> = {};

    const loggedInUserUpdates: Record<string, any> = {
      $pull: { blockedUsers: userToUnblock._id }
    };

    if (!isBlocked) {
      const userToUnblockConnectionsContainId = userToUnblock.connections.some(
        (id) => id.toString() === req.user._id.toString()
      );

      const loggedInUserConnectionsContainId = req.user.connections.some(
        (id) => id.toString() === userToUnblock._id.toString()
      );

      if (conversation && !conversation.deletedBy) {
        if (!userToUnblockConnectionsContainId) {
          userToUnblockUpdates.$push = {
            connections: req.user._id
          };
        }

        if (!loggedInUserConnectionsContainId) {
          loggedInUserUpdates.$push = {
            connections: userToUnblock._id
          };
        }
      } else if (
        conversation.deletedBy.toString() === req.user._id.toString()
      ) {
        if (!userToUnblockConnectionsContainId) {
          userToUnblockUpdates.$push = {
            connections: req.user._id
          };
        }
      } else if (
        conversation.deletedBy.toString() === userToUnblock._id.toString()
      ) {
        if (!loggedInUserConnectionsContainId) {
          loggedInUserUpdates.$push = {
            connections: userToUnblock._id
          };
        }
      }

      userToUnblock = await User.findByIdAndUpdate(
        userToUnblock._id,
        userToUnblockUpdates,
        { new: true }
      );

      const user = await User.findByIdAndUpdate(
        req.user._id,
        loggedInUserUpdates,
        { new: true }
      );

      req.user = user;
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user: req.user,
        recipientUser: userToUnblock,
        conversation
      }
    });
  }
);
