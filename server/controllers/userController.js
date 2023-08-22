const catchAsync = require('../middleware/catchAsync');
const User = require('../models/userModel');

exports.getMe = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (!user) return next(new AppError('No user found.', 404));

  res.status(200).json({
    status: 'success',
    data: user
  });
});
