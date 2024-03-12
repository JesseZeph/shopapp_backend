import { catchAsync, JoiValidationError } from '../utils/errorHandler.js';

export const validateInputBody = (schema) =>
  catchAsync(async (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new JoiValidationError(error);
    }

    next();
  });
