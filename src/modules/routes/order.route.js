import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  updateOrder,
  verifyOrderPayment,
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';
import { validateInputBody } from '../../common/validators/base.validation.js';
import {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  verifyOrderValidationSchema,
} from '../../common/validators/order.validation.js';

const router = Router();

export const orderRoutes = () => {
  /**
   * create order
   */
  router.post(
    '/',
    [validateInputBody(createOrderValidationSchema), authenticate],
    createOrder,
  );

  /**
   * get user orders
   */
  router.get('/', authenticate, getUserOrders);

  /**
   * verify order payment
   */
  router.post(
    '/payment/verify',
    [validateInputBody(verifyOrderValidationSchema), authenticate],
    verifyOrderPayment,
  );

  /**
   * update order
   */
  router.put(
    '/:id',
    [validateInputBody(updateOrderValidationSchema), authenticate],
    updateOrder,
  );

  return router;
};
