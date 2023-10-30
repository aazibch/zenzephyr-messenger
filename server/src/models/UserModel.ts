import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser {
  displayName: string;
  username: string;
  email: string;
  profileImage: string;
  password: string;
  passwordChangeDate: Date;
}

interface IUserMethods {
  isPasswordCorrect(inputPass: string, encryptedPass: string): Promise<boolean>;
  changedPasswordAfterToken(tokenIssuanceTimestamp: number): boolean;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  displayName: {
    type: String
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    maxlength: [50, 'The username should have fewer than fifty characters.'],
    minlength: [3, 'The username should at least have three characters.'],
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
    required: [true, 'Please provide an email address.'],
    validate: [validator.isEmail, 'Please provide a valid email address.'],
    unique: true,
    maxlength: [
      50,
      'The email address should have fewer than fifty characters.'
    ],
    minlength: [5, 'The email address should at least have five characters.']
  },
  profileImage: {
    type: String,
    default:
      'https://res.cloudinary.com/aazibch/image/upload/v1692366211/zephyr-messenger/users/default.jpg'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'The password should at least have eight characters.'],
    select: false
  },
  passwordChangeDate: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  this.displayName = this.username;
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
