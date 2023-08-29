const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const catchAsync = require('../middleware/catchAsync');
const { filterObject } = require('../utils/index');
const AppError = require('../utils/AppError');

exports.createConversation = catchAsync(async (req, res, next) => {
  const filteredConversation = filterObject(
    req.body,
    'participants',
    'message'
  );
  const filteredMessage = filterObject(req.body.message, 'content');

  filteredConversation.messages = [
    { ...filteredMessage, sender: req.user._id }
  ];
  filteredConversation.unreadBy = filteredConversation.participants[0];
  filteredConversation.participants.push(req.user._id);

  const conversation = await Conversation.create(filteredConversation);

  const sender = await User.findById(
    conversation.messages[conversation.messages.length - 1].sender
  );

  // Returning data pertaining to the message.
  const data = {
    ...conversation.messages[conversation.messages.length - 1].toObject(),
    conversationId: conversation._id,
    sender,
    recipient: conversation.participants.find(
      (user) => user._id.toString() !== sender._id.toString()
    ),
    notification: true
  };

  res.status(201).json({
    status: 'success',
    data: data
  });
});
