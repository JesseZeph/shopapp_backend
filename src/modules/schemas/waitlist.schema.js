import mongoose from 'mongoose';

const waitListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    quantity: {
        type: Number,
        default: 1,
      },  
  },
  { timestamps: true },
);

export const WaitListModel = mongoose.model('WaitList', waitListSchema);
