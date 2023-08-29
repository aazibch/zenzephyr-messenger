const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: [
      255,
      'Message content should have fewer than two hundred and fifty six characters.'
    ],
    required: true
  },
  dateSent: {
    type: Date,
    default: Date.now
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

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
  messages: {
    type: [messageSchema],
    required: [true, 'The conversation must contain at least one message.']
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
