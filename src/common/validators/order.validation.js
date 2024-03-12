import Joi from 'joi';

export const createOrderValidationSchema = Joi.object({
  address: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  deliveryType: Joi.string().required(),
});

export const verifyOrderValidationSchema = Joi.object({
  reference: Joi.string().required(),
});

export const updateOrderValidationSchema = Joi.object({
  orderStatus: Joi.string()
    .valid('PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED')
    .required(),
  deliveryStatus: Joi.string()
    .valid('PREPARING', 'IN_TRANSIT', 'DELIVERED', 'NOT_DELIVERED')
    .required(),
});
