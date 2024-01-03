import mongoose, { ObjectId, Model } from 'mongoose';
import Conversation from './ConversationModel';

interface TextContentProps {
  type: 'text';
  text: {
    content: string;
  };
}

interface ImageContentProps {
  type: 'image';
  image: {
    url: string;
    width: number;
    height: number;
  };
}

interface IMessage {
  conversation: ObjectId;
  recipient: ObjectId;
  sender: ObjectId;
  contentProps: TextContentProps | ImageContentProps;
  deletedBy: ObjectId;
}

interface MessageModel extends Model<IMessage> {
  setSnippet(doc: IMessage): void;
  setUpdateDate(doc: IMessage): void;
}

const messageSchema = new mongoose.Schema<IMessage, MessageModel>(
  {
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
        type: {
          url: { type: mongoose.Schema.Types.String },
          width: { type: mongoose.Schema.Types.Number },
          height: { type: mongoose.Schema.Types.Number }
        },
        required: function () {
          return this.contentProps.type === 'image';
        }
      },
      text: {
        type: {
          content: {
            type: mongoose.Schema.Types.String
          }
        },
        required: function () {
          return this.contentProps.type === 'text';
        }
      }
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

messageSchema.statics.setSnippet = async function (messageDoc) {
  let snippet: string;

  if (messageDoc.contentProps.type === 'text') {
    snippet = messageDoc.contentProps.text.content;
  } else if (messageDoc.contentProps.type === 'image') {
    snippet = '**[imageIcon] Image**';
  }

  await Conversation.findByIdAndUpdate(messageDoc.conversation, { snippet });
};

messageSchema.statics.setUpdateDate = async function (messageDoc) {
  await Conversation.findByIdAndUpdate(messageDoc.conversation, {
    updatedAt: new Date()
  });
};

messageSchema.post('save', function () {
  Message.setSnippet(this);
  Message.setUpdateDate(this);
});

const Message = mongoose.model<IMessage, MessageModel>(
  'Message',
  messageSchema
);

export default Message;
