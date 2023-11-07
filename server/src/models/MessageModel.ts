import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    required: true
  },
  contentProps: {
    type: {
      type: mongoose.Schema.Types.String,
      enum: ['text', 'image'],
      required: true
    },
    image: {
      type: mongoose.Schema.Types.String,
      required: function () {
        this.contentProps.type === 'image';
      }
    },
    text: {
      type: mongoose.Schema.Types.String,
      required: function () {
        this.contentProps.type === 'text';
      }
    },
    required: true
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
