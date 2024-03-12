import { AppResponse } from '../../common/utils/appResponse.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import { ProductModel } from '../schemas/product.schema.js';
import AppError from '../../common/utils/appError.js';
import { WaitListModel } from '../schemas/waitlist.schema.js';
import { UserModel } from '../schemas/user.schema.js';


export const addProductToWaitlist = catchAsync(async(req, res) => {
  const productId = req.params.productId
  const user = req.user

  const product = await ProductModel.findById(productId);

  if(!product) {
    throw new AppError('Product does not exist', 404);
  }

  let productCheck = await WaitListModel.findOne({user: user._id, product: productId});
 
  if (productCheck) {
    throw new AppError('Product already exists in waitlist', 409);
  }

  await WaitListModel.create({
    user: user._id,
    product: productId
  })

    let waitlist = await WaitListModel.find({user: user._id}).populate('product');


    return AppResponse(res, 200, waitlist ,'Product added to waitlist successful');
  
});

export const removeProductFromWaitlist = catchAsync(async(req, res) => {
  const productId = req.params.productId
  const user = req.user

  await WaitListModel.findOneAndRemove({
    user: user._id,
    product: productId
  })


  let waitlist = await WaitListModel.find({user: user._id}).populate('product');


  return AppResponse(res, 200, waitlist ,'Product removed from waitlist successful');
});

export const getWaitlist = catchAsync(async (req, res) => {
  const reqUser = req.user;

  const wishlist = await WaitListModel.find({ user: reqUser._id }).populate(
    'product',
  );

  if (!wishlist) {
    throw new AppError('Waitlist not found', 404);
  }

  return AppResponse(res, 200, wishlist, 'Waitlist retrieved successfully');
})

export const getAdminWaitlist = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 10; // Number of records per page

  const skip = (page - 1) * limit;
  
  // Find all waitlist records and populate the 'user' and 'product' fields
  const waitlist = await WaitListModel.find()
                                      .populate('user')
                                      .populate('product')
                                      .skip(skip)
                                      .limit(limit);

  if (!waitlist || waitlist.length === 0) {
    throw new AppError('Waitlist not found', 404);
  }

 
  
  const response = {};
  waitlist.forEach((item) => {
    const userId = item.user._id.toString();
    if (!response[userId]) {
      response[userId] = {
        user: item.user, 
        waitlist: [],
      };
    }
    response[userId].waitlist.push(item.product);
  });

  // Convert the response object to an array
  const finalResponse = Object.values(response);

    // Calculate pagination information
    const totalRecords = await WaitListModel.countDocuments();
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
  
    return AppResponse(res, 200, { waitlists: finalResponse, pagination: paginationInfo }, 'Waitlists retrieved successfully');
  
})


export const adminAddProductToWaitlist = catchAsync(async(req, res) => {

  const { userId, productId } = req.body;

  const user = await UserModel.findById(userId);

  if(!user) {
    throw new AppError('User does not exist', 404);
  }

  const product = await ProductModel.findById(productId);

  if(!product) {
    throw new AppError('Product does not exist', 404);
  }

  let productCheck = await WaitListModel.findOne({user: user._id, product: productId});
 
  if (productCheck) {
    throw new AppError('Product already exists in waitlist', 409);
  }

  await WaitListModel.create({
    user: user._id,
    product: productId
  })


    return AppResponse(res, 200, null ,'Product added to waitlist successful');
  
});


export const adminRemoveProductFromWaitlist = catchAsync(async(req, res) => {
  const { userId, productId } = req.body;

  const user = await UserModel.findById(userId);

  if(!user) {
    throw new AppError('User does not exist', 404);
  }

  await WaitListModel.findOneAndRemove({
    user: user._id,
    product: productId
  })



  return AppResponse(res, 200, null ,'Product removed from waitlist successful');
});

