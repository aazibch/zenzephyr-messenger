const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const catchAsync = require('../middleware/catchAsync');
const { filterObject } = require('../utils/index');
const AppError = require('../utils/AppError');

exports.createMessage = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: { $in: [req.user._id] }
  });

  let data = { notification: false };

  if (!conversation) return next(new AppError('Conversation not found.', 404));

  if (!conversation.approved)
    return next(
      new AppError(
        'Unable to send message as the conversation has not been approved.',
        403
      )
    );

  let filteredBody = filterObject(req.body, 'content', 'unread');

  filteredBody.sender = req.user._id;
  filteredBody.conversation = conversationId;

  const newMessage = await Message.create(filteredBody);

  if (!conversation.unreadBy && filteredBody.unread) {
    conversation.unreadBy = conversation.participants.find(
      (user) => filteredBody.sender.toString() !== user._id.toString()
    );

    data.notification = true;
  }

  await conversation.save();

  const recipient = conversation.participants.find(
    (id) => id.toString() !== req.user._id.toString()
  );

  const sender = await User.findById(req.user._id);

  data = {
    ...data,
    ...newMessage.toObject(),
    recipient,
    sender
  };

  res.status(200).json({
    status: 'success',
    data
  });
});
