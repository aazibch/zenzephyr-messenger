const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
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

exports.createConversation = catchAsync(async (req, res, next) => {
  const filteredConversation = filterObject(
    req.body,
    'participants',
    'message'
  );
  const filteredMessage = filterObject(req.body.message, 'content');
  filteredConversation.participants.unshift(req.user._id);
  filteredConversation.unreadBy = filteredConversation.participants[1];

  const conversation = await Conversation.create(filteredConversation);
  const message = await Message.create({
    ...filteredMessage,
    conversation: conversation._id,
    sender: req.user._id
  });

  const sender = await User.findById(message.sender);

  // Returning data pertaining to the message.
  const data = {
    ...message.toObject(),
    sender,
    recipient: conversation[1],
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

    await Message.updateMany(
      { conversation: conversationId },
      { deletedBy: req.user._id }
    );

    await conversation.save();
    // conversation.messages = conversation.messages.map((el) => {
    //   el.deletedBy = req.user._id;
    //   return el;
    // });
  }

  res.status(204).json({
    status: 'success',
    message: 'Conversation was deleted successfully.',
    data: conversation
  });
});
