import AppError from '../../common/utils/appError.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { TransactionModel } from '../schemas/transaction.schema.js';

import { ENVIRONMENT } from '../../common/config/environment.js';



export const getTransactions = catchAsync(async(req, res) => {
  const userId = req.user._id; 
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;

  const userTransactions = await TransactionModel.find({ user: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    if (!userTransactions || userTransactions.length === 0) {
      throw new AppError('Transactions not found for the specified user', 404);
    }

     // Calculate pagination information
  const totalRecords = await TransactionModel.countDocuments({ user: userId });
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

  return AppResponse(res, 200, { data: userTransactions, pagination: paginationInfo }, 'User Transactions retrieved successfully');
})

export const getUserTransactions = catchAsync(async(req, res) => {
  const {  userId } = req.body;

  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;

  const userTransactions = await TransactionModel.find({ user: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    if (!userTransactions || userTransactions.length === 0) {
      throw new AppError('Transactions not found for the specified user', 404);
    }

     // Calculate pagination information
  const totalRecords = await TransactionModel.countDocuments({ user: userId });
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

  return AppResponse(res, 200, { data: userTransactions, pagination: paginationInfo }, 'User Transactions retrieved successfully');
})

export const getAllTransactions = catchAsync(async(req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;

  // Find all transactions and populate the 'user' field
  const allTransactions = await TransactionModel.find()
    .populate('user')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    if (!allTransactions || allTransactions.length === 0) {
      throw new AppError('Transactions not found', 404);
    }
  
    // Calculate pagination information
    const totalRecords = await TransactionModel.countDocuments();
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
  
    return AppResponse(res, 200, { transactions: allTransactions, pagination: paginationInfo }, 'All Transactions retrieved successfully');
})