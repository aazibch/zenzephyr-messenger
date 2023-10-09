const multer = require('multer');
const sharp = require('sharp');
const { v2: cloudinary } = require('cloudinary');
const catchAsync = require('../middleware/catchAsync');
const User = require('../models/userModel');
const { filterObject } = require('../utils/index');
const AppError = require('../utils/AppError');
const Conversation = require('../models/conversationModel');
const {
  getExistingConversation
} = require('../controllers/conversationController');

exports.getMe = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (!user) return next(new AppError('No user found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, next) => {
  if (file.mimetype.startsWith('image')) {
    return next(null, true);
  }

  next(
    new AppError('Not an image. Only image formats are accepted.', 400),
    false
  );
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProfilePhoto = upload.single('profilePhoto');

exports.resizeProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}`;

  const buffer = await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  req.file.buffer = buffer;

  next();
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.saveProfilePhotoToCloud = catchAsync(async (req, res, next) => {
  const base64 = Buffer.from(req.file.buffer).toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${base64}`;

  const savedProfilePhoto = await cloudinary.uploader.upload(dataUri, {
    folder: 'zephyr-messenger/users',
    public_id: req.file.filename
  });

  req.file.publicUrl = savedProfilePhoto.url.replace('http', 'https');

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObject(req.body, 'username', 'email');

  if (req.file?.publicUrl) filteredBody.profilePhoto = req.file.publicUrl;

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Your data was updated successfully.',
    data: user
  });
});

exports.findUserToConnect = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({
    username: {
      $regex: username + '$',
      $options: 'im'
    }
  });

  if (!user || user._id.toString() === req.user._id.toString())
    return next(new AppError('User not found.', 404));

  const existingConversation = await getExistingConversation(
    req.user._id,
    user._id
  );

  if (existingConversation)
    return next(
      new AppError('A conversation with the provided user already exists.', 400)
    );

  res.status(200).json({
    status: 'success',
    data: user
  });
});
