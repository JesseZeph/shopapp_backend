import mongoose from 'mongoose';

const installmentPaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    amount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    }
  },
  { timestamps: true },
);

export const InstallmentPaymentModel = mongoose.model('InstallmentPayment', installmentPaymentSchema);
