const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const catchAsync = require('../middleware/catchAsync');
const { filterObject } = require('../utils/index');
const AppError = require('../utils/AppError');

exports.approveConversation = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) return next(new AppError('Conversation not found.', 404));

  if (conversation.participants[0]._id.toString() !== req.user._id.toString())
    return next(new AppError('Conversation not found.', 404));

  conversation.approved = true;
  await conversation.save();

  res.status(200).json({
    status: 'success',
    data: conversation
  });
});

// @todo: refactor
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

exports.deleteConversation = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: { $in: [req.user._id] }
  });

  if (!conversation) return next(new AppError('Conversation not found.', 404));

  if (
    conversation.deletedBy &&
    conversation.deletedBy.toString() !== req.user._id.toString()
  ) {
    await Conversation.findByIdAndDelete(conversation._id);
  } else {
    conversation.deletedBy = req.user._id;

    conversation.messages = conversation.messages.map((el) => {
      el.deletedBy = req.user._id;
      return el;
    });

    await conversation.save();
  }

  res.status(204).json({
    status: 'success',
    message: 'Conversation was deleted successfully.',
    data: conversation
  });
});
