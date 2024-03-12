import { Router } from 'express';
import {
  addProductToWaitlist,
  getWaitlist,
  getAdminWaitlist,
  removeProductFromWaitlist,
  adminAddProductToWaitlist,
  adminRemoveProductFromWaitlist,
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';

const router = Router();

export const waitListRoutes = () => {

  /**
   * user add product to waitlist
   */
  router.post('/:productId', authenticate, addProductToWaitlist);

  /**
   * user remove product from waitlist
   */
  router.delete('/:productId', authenticate, removeProductFromWaitlist);

  /**
   * user get waitlist
   */
  router.get('/', authenticate, getWaitlist);

  /**
   * admin get waitlists
   */
  router.get('/admin/list', authenticate, getAdminWaitlist);

   /**
   * admin add product to waitlist
   */
   router.post('/admin/add', authenticate, adminAddProductToWaitlist);

   /**
    * admin remove product from waitlist
    */
   router.delete('/admin/remove', authenticate, adminRemoveProductFromWaitlist);

  return router;
};
