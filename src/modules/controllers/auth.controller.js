import { catchAsync } from '../../common/utils/errorHandler.js';
import { UserModel } from '../schemas/user.schema.js';
import AppError from '../../common/utils/appError.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { UserTransformer } from '../../common/transformers/index.js';
import { signToken } from '../../common/utils/helper.js';
import { ENVIRONMENT } from '../../common/config/environment.js';
import { WalletModel } from '../schemas/wallet.schema.js';

export const userSignup = catchAsync(async (req, res) => {
  const { name, username, email, password } = req.body;

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    throw new AppError('User with email already exists', 400);
  }

  const user = await UserModel.create({
    name,
    username,
    email,
    password,
  });

  await WalletModel.create({
    user: user._id,
    balance: 0
  })

  return AppResponse(
    res,
    200,
    UserTransformer(user),
    'User created successfully',
  );
});

export const userLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await new UserModel().validateCredentials(email, password);

  const token = signToken({
    sub: user._id,
    email: user.email,
  });

  return AppResponse(
    res,
    200,
    {
      ...UserTransformer(user)['_doc'],
      token,
    },
    'User logged in successfully',
  );
});

export const adminSignup = catchAsync(async (req, res) => {
  const { name, email, username, password, secret } = req.body;

  if (secret !== ENVIRONMENT.ADMIN.SECRET) {
    throw new AppError('Unauthorized - invalid secret', 401);
  }

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    throw new AppError('User with email already exists', 400);
  }

  const user = await UserModel.create({
    name,
    username,
    email,
    password,
    role: 'admin',
  });

  return AppResponse(
    res,
    200,
    UserTransformer(user),
    'Admin created successfully',
  );
});
