import { Router } from 'express';
import {
  addProductToWishlist,
  fundWallet,
  getProfile,
  getWallet,
  getWishlist,
  removeProductFromWishlist,
  verifyWalletFunding
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';

const router = Router();

export const userRoutes = () => {
  /**
   * get user
   */
  router.get('/profile', authenticate, getProfile);

  /**
   * add product to wishlist
   */
  router.post('/wishlist/:id', authenticate, addProductToWishlist);

  /**
   * remove product from wishlist
   */
  router.delete('/wishlist/:id', authenticate, removeProductFromWishlist);

  /**
   * get user wishlist
   */
  router.get('/wishlist', authenticate, getWishlist);


   /**
   * user get wallet
   */
   router.get('/wallet', authenticate, getWallet);


  /**
   * user fund wallet
   */
  router.post('/wallet', authenticate, fundWallet);


   /**
   * user verify wallet funding
   */
   router.post('/wallet/verify', authenticate, verifyWalletFunding);  
  return router;
};
