const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { filterObject } = require('../utils/index');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const filteredBody = filterObject(
    req.body,
    'username',
    'email',
    'password',
    'confirmPassword'
  );

  const newUser = await User.create(filteredBody);

  const token = signToken(newUser._id);

  // Remove the password property.
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    message: 'Your account was created successfully.',
    token,
    data: {
      userId: newUser._id
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('Please provide an email address and password.', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email address or password.', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'You were logged in successfully.',
    token,
    data: {
      userId: user._id
    }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError("You're not logged in.", 401));
  }

  let decodedToken;

  try {
    decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("You're not logged in.", 401));
  }

  const user = await User.findById(decodedToken.id);

  if (!user || user.changedPasswordAfterToken(decodedToken.iat)) {
    return next(new AppError("You're not logged in.", 401));
  }

  req.user = user;
  next();
});
