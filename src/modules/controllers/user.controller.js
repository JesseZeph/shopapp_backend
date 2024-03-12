import AppError from '../../common/utils/appError.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import {
  initializeTransaction,
  verifyTransaction,
} from '../../common/utils/paystack.js';
import { UserModel } from '../schemas/user.schema.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { WishListModel } from '../schemas/wishlist.schema.js';
import { ProductModel } from '../schemas/product.schema.js';
import { TransactionModel } from '../schemas/transaction.schema.js';
import { ENVIRONMENT } from '../../common/config/environment.js';
import { WalletModel } from '../schemas/wallet.schema.js';


export const getProfile = catchAsync(async (req, res) => {
  const reqUser = req.user;

  return AppResponse(res, 200, reqUser, 'User profile retrieved successfully');
});

export const addProductToWishlist = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const reqUser = req.user;

  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  let wishlist = await WishListModel.findOne({ user: reqUser._id });

  if (!wishlist) {
    await WishListModel.create({
      user: reqUser._id,
    });
  }

  wishlist = await WishListModel.findOneAndUpdate(
    { user: reqUser._id },
    { $addToSet: { products: productId } },
    { new: true },
  );

  return AppResponse(res, 200, wishlist, 'Product added to wishlist');
});

export const removeProductFromWishlist = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const reqUser = req.user;

  const wishlist = await WishListModel.findOneAndUpdate(
    { user: reqUser._id },
    { $pull: { products: productId } },
    { new: true },
  );

  return AppResponse(res, 200, wishlist, 'Product removed from wishlist');
});

export const getWishlist = catchAsync(async (req, res) => {
  const reqUser = req.user;

  const wishlist = await WishListModel.findOne({ user: reqUser._id }).populate(
    'products',
  );

  if (!wishlist) {
    throw new AppError('Wishlist not found', 404);
  }

  return AppResponse(res, 200, wishlist, 'Wishlist retrieved successfully');
});


export const fundWallet = catchAsync(async(req, res) => {
  const reqUser = req.user;
  const { amountToFund, paymentMethod } = req.body;

  // Record the payment in the TransactionModel
  const transaction = await TransactionModel.create({
    user: reqUser._id,
    amount: amountToFund,
    type: 'credit', 
    description: 'Wallet funding',
    status: 'Unverified',
  });

  let checkoutUrl = await initializeTransaction({
    amount: amountToFund * 100,
    email: reqUser.email,
    callback_url: ENVIRONMENT.PAYSTACK.CALLBACK_URL,
    metadata: {
      transactionId: transaction._id,
      type: 'wallet funding'
    },
  });

  await transaction.save()

  return AppResponse(res, 200, {paymentUrl:checkoutUrl}, 'Wallet payment recorded successfully')
})

export const verifyWalletFunding = catchAsync(async(req, res) => {
  const reqUser = req.user

  const { reference } = req.body;

  // Verify the payment transaction
  const verificationStatus = await verifyTransaction(reference);

  if (!verificationStatus || !verificationStatus.status) {
    throw new AppError('Payment verification failed', 400);
  }

  const { metadata } = verificationStatus.data;

  // Find the wallet record for the user
  const wallet = await WalletModel.findOne({ user: reqUser._id });

  if (!wallet) {
    throw new AppError('Wallet not found for the user', 404);
  }

  // Find the transaction record
  const transaction = await TransactionModel.findOne({ _id: metadata.transactionId });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  if (transaction.status === 'Verified') {
    throw new AppError('Transaction already verified', 400);
  }

  // Update wallet balance
  wallet.balance += transaction.amount;

  // Update transaction status
  transaction.status = 'Verified';

  // Save changes
  await Promise.all([wallet.save(), transaction.save()]);

  return AppResponse(res, 200, null, 'Wallet funding verified successfully');
})

export const getWallet = catchAsync(async(req, res) => {
  const reqUser = req.user;

  // Find the wallet record for the user
  const wallet = await WalletModel.findOne({ user: reqUser._id });

  if (!wallet) {
    throw new AppError('Wallet not found for the user', 404);
  }

  return AppResponse(res, 200, { balance: wallet.balance }, 'Wallet details retrieved successfully');
})