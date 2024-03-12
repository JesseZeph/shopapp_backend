import Joi from 'joi';

export const validateMongoUUID = () => {
  return Joi.custom((value, helpers) => {
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      return value;
    }
    return helpers.error('any.invalid');
  }, 'MongoDB UUID Validation')
    .required()
    .error(() => {
      throw new Error('invalid id');
    });
};
