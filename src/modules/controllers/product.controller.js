import { AppResponse } from '../../common/utils/appResponse.js';
import { catchAsync } from '../../common/utils/errorHandler.js';
import { ProductModel } from '../schemas/product.schema.js';
import AppError from '../../common/utils/appError.js';
import { uploadFiles } from '../../common/utils/cloudinary.js';

export const createProducts = catchAsync(async (req, res) => {
  const { name, description, category, price, discountPrice, stock } = req.body;
  const files = req.files;

  const product = await ProductModel.create({
    name,
    description,
    category,
    images: await uploadFiles(files),
    price,
    discountPrice,
    stock,
  });

  return AppResponse(res, 201, product, 'Product created successfully');
});

export const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const { name, description, category, price, discountPrice, stock } = req.body;
  const files = req.files;

  const productExist = await ProductModel.findOne({ _id: productId });

  if (!productExist) {
    throw new AppError('Product not found', 404);
  }

  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    {
      name,
      description,
      category,
      images: [...productExist['_doc'].images, ...(await uploadFiles(files))],
      price,
      discountPrice,
      stock,
    },
    { new: true },
  );

  return AppResponse(res, 200, product, 'Product updated successfully');
});

export const getProducts = catchAsync(async (req, res) => {
  const products = await ProductModel.find();

  return AppResponse(res, 200, products, 'Products retrieved successfully');
});

export const getProductById = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return AppResponse(res, 200, product, 'Product retrieved successfully');
});

export const rateProductById = catchAsync(async (req, res) => {
  const { productId, rating } = req.body;
  const reqUser = req.user;

  const [product, _] = await Promise.all([
    ProductModel.findOne({ _id: productId }),
    ProductModel.updateOne(
      { _id: productId, ratedBy: { $nin: reqUser._id } },
      {
        $inc: {
          [`ratings.${rating}`]: 1,
        },
        $push: {
          ratedBy: reqUser._id,
        },
      },
    ),
  ]);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.ratedBy.includes(req.user._id)) {
    throw new AppError('You have already rated this product', 400);
  }

  return AppResponse(res, 200, null, 'Product rated successfully');
});

export const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

    // Find the product by ID and update the 'deleted' field
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: { deleted: true } },
      { new: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return AppResponse(res, 200, null, 'Product deleted successfully');
})
