import AppError from '../../common/utils/appError.js';
import { AppResponse } from '../../common/utils/appResponse.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import { CartModel } from '../schemas/cart.schema.js';
import { ProductModel } from '../schemas/product.schema.js';

export const addProductToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const reqUser = req.user;

  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  let cart = await CartModel.findOne({ user: reqUser._id });

  if (!cart) {
    cart = await CartModel.create({
      user: reqUser._id,
      products: [
        {
          product: productId,
          quantity: quantity,
        },
      ],
      totalPrice: product.price,
    });
  } else {
    const productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
      });
    }

    cart = await CartModel.findOneAndUpdate(
      { user: reqUser._id },
      {
        products: cart.products,
        totalPrice: cart.totalPrice + quantity * product.price,
      },
      { new: true },
    );
  }

  return AppResponse(res, 200, cart, 'Product added to cart');
});

export const removeProductFromCart = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const reqUser = req.user;

  const cart = await CartModel.findOne({ user: reqUser._id }).populate(
    'products.product',
  );

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.products = cart.products.filter(
    (p) => p.product._id.toString() !== productId.toString(),
  );
  const updatedCart = await CartModel.findOneAndUpdate(
    { user: reqUser._id },
    {
      products: cart.products,
      totalPrice: cart.products.reduce(
        (acc, cur) => acc + cur.quantity * cur.product.price,
        0,
      ),
    },
    { new: true },
  );

  return AppResponse(res, 200, updatedCart, 'Product removed from cart');
});

export const getCart = catchAsync(async (req, res) => {
  const reqUser = req.user;

  const cart = await CartModel.findOne({ user: reqUser._id }).populate(
    'products.product',
  );

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  return AppResponse(res, 200, cart, 'Cart retrieved successfully');
});
