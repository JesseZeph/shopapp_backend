import AppError from '../../common/utils/appError.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import {
  initializeTransaction,
  verifyTransaction,
} from '../../common/utils/paystack.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { InstallmentPaymentModel } from '../schemas/installmentPayment.schema.js';
import { TransactionModel } from '../schemas/transaction.schema.js';
import { WalletModel } from '../schemas/wallet.schema.js';
import { ProductModel } from '../schemas/product.schema.js';
import { ENVIRONMENT } from '../../common/config/environment.js';

export const getUserInstallmentPayments = catchAsync(async(req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;
  const reqUser = req.user;

  const installmentPayments = await InstallmentPaymentModel.find({ user: reqUser._id }).populate('product').skip(skip)
                                                            .limit(limit);;
  
  if (!installmentPayments || installmentPayments.length === 0) {
    throw new AppError('InstallmentPayments not found', 404);
  }

   // Calculate pagination information
   const totalRecords = await InstallmentPaymentModel.countDocuments();
   const totalPages = Math.ceil(totalRecords / limit);
   const hasNextPage = page < totalPages;
   const hasPrevPage = page > 1;
 
   const paginationInfo = {
     currentPage: page,
     totalPages,
     totalRecords,
     hasNextPage,
     hasPrevPage,
   };

  return AppResponse(res, 200, {  installmentPayments, pagination: paginationInfo }, 'Installment Payments retrieved successfully');
})

export const getAdminInstallmentPayments = catchAsync(async(req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;

  const installmentPayments = await InstallmentPaymentModel.find()
                                                           .populate('user')
                                                           .populate('product')
                                                           .skip(skip)
                                                           .limit(limit);
  
  if (!installmentPayments || installmentPayments.length === 0) {
    throw new AppError('InstallmentPayments not found', 404);
  }
     // Calculate pagination information
  const totalRecords = await InstallmentPaymentModel.countDocuments();
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginationInfo = {
    currentPage: page,
    totalPages,
    totalRecords,
    hasNextPage,
    hasPrevPage,
  };
  

  return AppResponse(res, 200, {  installmentPayments, pagination: paginationInfo }, 'Installment Payments retrieved successfully');
})

export const makeInstallmentPayment = catchAsync(async(req, res) => {
  const userId = req.user._id;
  const {  productId, amountPaid, quantity, paymentMethod } = req.body;
  let checkoutUrl, calcAmount
  

    // Find or create an installment payment record for the user and product
    let installmentPayment = await InstallmentPaymentModel.findOne({ user: userId, product: productId });

    const product = await ProductModel.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404)
      }

    
  // Check if the payment method is 'wallet'
  if (paymentMethod === 'wallet') {
    const userWallet = await WalletModel.findOne({ user: userId });

    // Check if the user has a wallet
    if (!userWallet) {
      throw new AppError('User does not have a wallet', 400);
    }

    // Check if the wallet balance is sufficient
    if (userWallet.balance < amountPaid) {
      throw new AppError('Insufficient funds in the wallet', 400);
    }

    // Deduct the amount from the user's wallet
    userWallet.balance -= amountPaid;
    await userWallet.save();

    
  }


    if (!installmentPayment) {
      
      if (!quantity || quantity <= 0) {
        throw new AppError('Invalid quantity', 400);
      }

      

      installmentPayment = await InstallmentPaymentModel.create({
        user: userId,
        product: productId,
        // amount: amountPaid,
        // remainingAmount: calcAmount,
        quantity, 
        status: 'pending',
      });

     
    } 


    if(paymentMethod === 'wallet') {
      calcAmount = (product.price * installmentPayment.quantity) - installmentPayment.amount - amountPaid
      installmentPayment.amount = amountPaid
      installmentPayment.remainingAmount = calcAmount


      if (calcAmount === 0) {
        installmentPayment.status = 'completed';
      }
    }

    


    // Record the payment in the TransactionModel
   let transaction = await TransactionModel.create({
      user: userId,
      amount: amountPaid,
      type: 'debit',
      installment: 'yes',
      description: `Installment payment for ${product.name}`,
      status: paymentMethod === 'wallet' ? 'Verified' : 'Unverified'
    });

   

    // Save the updated installment payment record
    await installmentPayment.save();

    if (paymentMethod !== 'wallet'){
      checkoutUrl = await initializeTransaction({
      amount: amountPaid * 100,
      email: req.user.email,
      callback_url: ENVIRONMENT.PAYSTACK.CALLBACK_URL,
      metadata: {
        transactionId: transaction._id,
        installmentId: installmentPayment._id,
        type: 'installment payment'
      },
    });
  }
  

    return AppResponse(res, 200, {paymentUrl:checkoutUrl}, 'Installment payment recorded successfully')
})

export const verifyInstallment = catchAsync(async (req, res) => {
  const { reference } = req.body;

  
  const verificationStatus = await verifyTransaction(reference);

  if (!verificationStatus || !verificationStatus.status) {
    throw new AppError('Payment verification failed', 400);
  }

  const { metadata } = verificationStatus.data;

  const installmentPayment = await InstallmentPaymentModel.findOne({  _id: metadata.installmentId });

  if (!installmentPayment) {
    throw new AppError('Installment Payment not found', 404);
  }

  const transaction = await TransactionModel.findOne({ _id: metadata.transactionId });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  if (transaction.status === 'Verified') {
    throw new AppError('Transaction already verified', 400);
  }

  transaction.status = 'Verified'

  await transaction.save()
  const product = await ProductModel.findById(installmentPayment.product);
  if (!product) {
    throw new AppError('Product not found', 404)
  }

  let calcAmount = (product.price * installmentPayment.quantity) - installmentPayment.amount - transaction.amount

  // Update existing installment payment record
      installmentPayment.amount += transaction.amount;
      installmentPayment.remainingAmount =  calcAmount;

 await installmentPayment.save()     

return AppResponse(res, 200, null, 'Installment Payment verified successfully')
})
