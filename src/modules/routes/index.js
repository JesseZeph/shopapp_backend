import { Router } from 'express';
const router = Router();

import { userRoutes } from './user.route.js';
import { authRoutes } from './auth.route.js';
import { productRoutes } from './product.route.js';
import { cartRoutes } from './cart.route.js';
import { orderRoutes } from './order.route.js';
import { waitListRoutes } from './waitlist.route.js';
import { installmentRoutes } from './installment.route.js';
import { transactionRoutes } from './transaction.route.js';

export const setRoutes = () => {
  router.use('/auth', authRoutes());
  router.use('/user', userRoutes());
  router.use('/products', productRoutes());
  router.use('/cart', cartRoutes());
  router.use('/order', orderRoutes());
  router.use('/waitlist', waitListRoutes());
  router.use('/installment-payments', installmentRoutes());
  router.use('/transactions', transactionRoutes())
  return router;
};
