import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: {
      type: mongoose.Schema.Types.Mixed,
      1: Number,
      2: Number,
      3: Number,
      4: Number,
      5: Number,
      default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      get: function (r) {
        let items = Object.entries(r);
        let sum = 0;
        let total = 0;

        for (let [key, value] of items) {
          total += value;
          sum += value * parseInt(key);
        }

        return {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          ...r,
          totalRatings: sum === 0 && total === 0 ? 0 : Math.round(sum / total),
        };
      },
    },
    ratedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } },
);

export const ProductModel = mongoose.model('Product', productSchema);
