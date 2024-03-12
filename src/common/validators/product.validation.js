import { catchAsync, JoiValidationError } from '../utils/errorHandler.js';
import Joi from 'joi';
import { validateMongoUUID } from './custom.validation.js';

export const validateRateProductInput = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    rating: Joi.number().required().less(6).greater(1),
    productId: validateMongoUUID(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new JoiValidationError(error);
  }

  next();
});
