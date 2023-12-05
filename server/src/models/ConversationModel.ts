import mongoose, { ObjectId } from 'mongoose';

interface IConversation {
  _id: string | ObjectId;
  __v: number;
  participants: ObjectId[];
  startedBy: ObjectId;
  isBlocked?: boolean;
  deletedBy?: ObjectId;
  unreadBy?: ObjectId;
  messages: ObjectId[];
  snippet: string;
}

const checkIfValidParticipant = function (val: ObjectId) {
  return this.participants.includes(val);
};

const checkIfValidNumOfParticipants = function (val: ObjectId[]) {
  return val.length === 2;
};

const conversationSchema = new mongoose.Schema<IConversation>({
  participants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    validate: [
      checkIfValidNumOfParticipants,
      'There must be 2 participants in a conversation.'
    ],
    required: true,
    unique: true
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
  }
});

const Conversation = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);

export default Conversation;
