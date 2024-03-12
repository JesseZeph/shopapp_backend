import Joi from 'joi';
import { catchAsync, JoiValidationError } from '../utils/errorHandler.js';

export const validateSignupInput = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new JoiValidationError(error);
  }

  next();
});

export const validateLoginInput = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new JoiValidationError(error);
  }

  next();
});

export const validateAdminSignupInput = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    secret: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new JoiValidationError(error);
  }

  next();
});
