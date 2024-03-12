import { Router } from 'express';
import {
  createProducts,
  deleteProduct,
  getProductById,
  getProducts,
  rateProductById,
  updateProduct,
} from '../controllers/index.js';
import { authenticate } from '../../common/middlewares/authenticate.js';
import { validateRateProductInput } from '../../common/validators/index.js';
import upload from '../../common/utils/multer.js';

const router = Router();

export const productRoutes = () => {
  /**
   * create products
   */
  router.post('/', upload.array('images'), createProducts);

  /**
   * update product
   */
  router.put('/:id', upload.array('images'), updateProduct);

   /**
   * delete product
   */
   router.delete('/:id', authenticate, deleteProduct);

  /**
   * get products
   */
  router.get('/', getProducts);

  /**
   * get product by id
   */
  router.get('/:id', getProductById);

  /**
   * rate product by id
   */
  router.post(
    '/rate',
    [validateRateProductInput, authenticate],
    rateProductById,
  );

  return router;
};
