import mongoose, { ObjectId, Types } from 'mongoose';

interface TextContentProps {
  type: 'text';
  text: string;
}

interface ImageContentProps {
  type: 'image';
  image: string;
}

interface IMessage {
  conversation: ObjectId;
  recipient: ObjectId;
  sender: ObjectId;
  contentProps: TextContentProps | ImageContentProps;
  deletedBy: ObjectId;
}

const messageSchema = new mongoose.Schema<IMessage>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
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
        return this.contentProps.type === 'image';
      }
    },
    text: {
      type: mongoose.Schema.Types.String,
      required: function () {
        return this.contentProps.type === 'text';
      }
    }
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
