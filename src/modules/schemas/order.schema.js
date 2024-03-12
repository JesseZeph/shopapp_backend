import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    address: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'TRANSFER', 'WALLET'],
      default: 'TRANSFER',
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID'],
      default: 'UNPAID',
    },
    orderStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    deliveryType: {
      type: String,
      enum: ['DELIVERY', 'SELF_PICKUP'],
      default: 'DELIVERY',
    },
    deliveryStatus: {
      type: String,
      enum: ['PREPARING', 'IN_TRANSIT', 'DELIVERED', 'NOT_DELIVERED'],
      default: 'NOT_DELIVERED',
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model('Order', orderSchema);
