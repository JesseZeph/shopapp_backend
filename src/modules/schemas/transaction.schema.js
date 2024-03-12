import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    installment:{
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
      required: false
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Verified', 'Unverified'],
      default: 'Unverified'
    }
  },
  { timestamps: true },
);

export const TransactionModel = mongoose.model(
  'Transaction',
  transactionSchema,
);
