import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const hashSaltRounds = 15;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, hashSaltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.validateCredentials = async function (email, password) {
  try {
    const user = await this.model('User')
      .findOne({ email })
      .select('+password');

    if (!user) {
      throw new Error('User not found with provided email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Incorrect Password');
    }

    return user;
  } catch (e) {
    throw e;
  }
};

export const UserModel = mongoose.model('User', userSchema);
