const mongoose = require('mongoose');

const checkIfValidParticipant = function (val) {
  return this.participants.includes(val);
};

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: checkIfValidParticipant,
      message: 'Only participants can delete the conversation.'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  unreadBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: checkIfValidParticipant,
      message:
        'The user who has unread messages must be among the participants in the conversation.'
    }
  },
  approved: {
    type: Boolean,
    default: false
  }
});

conversationSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.lastUpdated = Date.now();
  }

  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
