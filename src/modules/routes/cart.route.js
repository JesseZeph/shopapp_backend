import { Router } from 'express';
import {
  addProductToCart,
  getCart,
  removeProductFromCart,
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';

const router = Router();

export const cartRoutes = () => {
  /**
   * get user cart
   */
  router.get('/', authenticate, getCart);

  /**
   * add product to cart
   */
  router.post('/', authenticate, addProductToCart);

  /**
   * remove product from cart
   */
  router.delete('/', authenticate, removeProductFromCart);

  return router;
};
