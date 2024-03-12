import { Router } from 'express';
import { adminSignup, userLogin, userSignup } from '../controllers/index.js';
import {
  validateAdminSignupInput,
  validateLoginInput,
  validateSignupInput,
} from '../../common/validators/auth.validation.js';

const router = Router();

export const authRoutes = () => {
  /**
   * user signup
   */
  router.post('/signup', validateSignupInput, userSignup);

  /**
   * user login
   */
  router.post('/login', validateLoginInput, userLogin);

  /**
   * admin signup
   */
  router.post('/xx/admin/signup', validateAdminSignupInput, adminSignup);

  return router;
};
