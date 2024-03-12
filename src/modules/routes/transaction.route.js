import { Router } from 'express';
import { authenticate } from '../../common/middlewares/authenticate.js';
import { getAllTransactions, getTransactions, getUserTransactions } from '../controllers/transaction.controller.js';

const router = Router();

export const transactionRoutes = () => {

  /**
   * user get transactions
   */
  router.get('/', authenticate, getTransactions)


   /**
   * admin get user transactions
   */
   router.post('/admin', authenticate, getUserTransactions)
  
  
   /**
   * admin all transactions
   */
   router.get('/admin/all', authenticate, getAllTransactions)
  
   return router;
};
