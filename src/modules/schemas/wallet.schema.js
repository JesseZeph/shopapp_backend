import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    balance: 
      {
        type: Number,
        default: 0
      },
  },
  { timestamps: true },
);

export const WalletModel = mongoose.model('Wallet', walletSchema);
