import { Router } from 'express';
import {
  getUserInstallmentPayments,
  getAdminInstallmentPayments,
  makeInstallmentPayment,
  verifyInstallment
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';

const router = Router();

export const installmentRoutes = () => {

  /**
   * user get installment payments
   */
  router.get('/', authenticate, getUserInstallmentPayments)


   /**
   * admin get installment payments
   */
   router.get('/admin', authenticate, getAdminInstallmentPayments)
  
  
   /**
   * user pay installment
   */
   router.post('/pay', authenticate, makeInstallmentPayment) 
   
   /**
   * verify installment payment
   */
   router.post('/verify', authenticate, verifyInstallment) 
  
   return router;
};
