import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';
import { generateValidationMessage } from '../utils/generateValidationMessage';

interface IUserMethods {
  isPasswordCorrect(inputPass: string, encryptedPass: string): Promise<boolean>;
  changedPasswordAfterToken(tokenIssuanceTimestamp: number): boolean;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  fullName: {
    type: String,
    required: [true, generateValidationMessage('required', 'full name')],
    maxlength: [75, generateValidationMessage('max', 'full name', 75)],
    minlength: [3, generateValidationMessage('min', 'full name', 3)],
    validate: {
      validator: function (val: string) {
        return /^[a-zA-Z ]*$/.test(val);
      },
      message: 'The full name may only contain alphabets and spaces.'
    }
  },
  username: {
    type: String,
    required: [true, generateValidationMessage('required', 'username')],
    maxlength: [50, generateValidationMessage('max', 'username', 50)],
    minlength: [3, generateValidationMessage('min', 'username', 3)],
    validate: {
      validator: function (val: string) {
        return /^[a-zA-Z0-9_]*$/.test(val);
      },
      message:
        'The username may only contain alphanumeric characters (letters A-Z, numbers 0-9) and underscores (_).'
    },
    unique: true
  },
  email: {
    type: String,
    required: [true, generateValidationMessage('required', 'email address')],
    validate: [validator.isEmail, generateValidationMessage('email')],
    unique: true,
    maxlength: [50, generateValidationMessage('max', 'email address', 50)],
    minlength: [5, generateValidationMessage('min', 'email address', 5)]
  },
  profileImage: {
    type: String,
    default:
      'https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg'
  },
  password: {
    type: String,
    required: [true, generateValidationMessage('required', 'password')],
    minlength: [8, generateValidationMessage('min', 'password', 8)],
    select: false
  },
  passwordChangeDate: Date,
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  this.username = this.username.toLowerCase();

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeDate = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  inputPass: string,
  encryptedPass: string
) {
  return await bcrypt.compare(inputPass, encryptedPass);
};

userSchema.methods.changedPasswordAfterToken = function (
  tokenIssuanceTimestamp: number
) {
  if (this.passwordChangeDate) {
    const passwordChangeTimestamp = this.passwordChangeDate.getTime() / 1000;

    return tokenIssuanceTimestamp < passwordChangeTimestamp;
  }

  return false;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
