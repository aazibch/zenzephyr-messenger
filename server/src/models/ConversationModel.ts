import mongoose, { ObjectId } from 'mongoose';
import { IConversation } from '../types';

const checkIfValidParticipant = function (val: ObjectId) {
  return this.otherUsers.includes(val);
};

const checkIfValidNumOfParticipants = function (val: ObjectId[]) {
  return val.length === 2;
};

const conversationSchema = new mongoose.Schema<IConversation>({
  otherUsers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    validate: [
      checkIfValidNumOfParticipants,
      'There must be 2 otherUsers in a conversation.'
    ],
    required: true
  },
  startedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: [
      checkIfValidParticipant,
      'Only a participant may start a conversation.'
    ],
    required: true
  },
  isBlocked: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: [
      checkIfValidParticipant,
      'Only a participant may delete a conversation.'
    ]
  },
  unreadBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: [
      checkIfValidParticipant,
      '{PATH} must have a participant as its value.'
    ]
  },
  snippet: {
    type: mongoose.Schema.Types.String
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  }
});

const Conversation = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);

export default Conversation;
