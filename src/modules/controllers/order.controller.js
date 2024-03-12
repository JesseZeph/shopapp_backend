import AppError from '../../common/utils/appError.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import {
  initializeTransaction,
  verifyTransaction,
} from '../../common/utils/paystack.js';
import { CartModel } from '../schemas/cart.schema.js';
import { OrderModel } from '../schemas/order.schema.js';
import { ENVIRONMENT } from '../../common/config/environment.js';

export const createOrder = catchAsync(async (req, res) => {
  const reqUser = req.user;
  const { address, paymentMethod, deliveryType } = req.body;

  const cart = await CartModel.findOne({ user: reqUser._id }).populate(
    'products.product',
  );

  if (!cart || cart.products.length === 0) {
    throw new AppError('no products in cart', 400);
  }

  const order = await OrderModel.create({
    products: cart.products.map((item) => {
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    }),
    user: reqUser._id,
    address,
    paymentMethod,
    deliveryType,
    totalPrice: cart.totalPrice,
  });

  await CartModel.updateOne(
    { user: reqUser._id },
    { $set: { products: [], totalPrice: 0 } },
  );

  const checkoutUrl = await initializeTransaction({
    amount: order.totalPrice * 100,
    email: reqUser.email,
    callback_url: ENVIRONMENT.PAYSTACK.CALLBACK_URL,
    metadata: {
      orderId: order._id,
    },
  });

  return AppResponse(
    res,
    200,
    { order, paymentUrl: checkoutUrl },
    'Order created successfully',
  );
});

export const getUserOrders = catchAsync(async (req, res) => {
  const reqUser = req.user;

  const orders = await OrderModel.find({
    user: reqUser._id,
  });

  return AppResponse(res, 200, orders, 'Orders retrieved successfully');
});

export const verifyOrderPayment = catchAsync(async (req, res) => {
  const { reference } = req.body;

  const verificationStatus = await verifyTransaction(reference);

  if (!verificationStatus || !verificationStatus.status) {
    throw new AppError('Payment verification failed', 400);
  }

  const { metadata } = verificationStatus.data;

  const order = await OrderModel.findOne({ _id: metadata.orderId });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.paymentStatus === 'PAID') {
    throw new AppError('Payment already verified', 400);
  }

  order.paidAt = Date.now();
  order.paymentStatus = 'PAID';
  await order.save();

  return AppResponse(res, 200, order, 'Payment verified successfully');
});

export const updateOrder = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus, deliveryStatus } = req.body;

  const order = await OrderModel.findOneAndUpdate(
    { _id: orderId },
    {
      $set: {
        orderStatus,
        deliveryStatus,
      },
    },
    { new: true },
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return AppResponse(res, 200, order, 'Order updated successfully');
});
