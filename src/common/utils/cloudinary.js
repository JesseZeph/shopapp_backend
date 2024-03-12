import { ENVIRONMENT } from '../config/environment.js';
import { v2 as cloudinary } from 'cloudinary';
import AppError from './appError.js';

cloudinary.config({
  cloud_name: ENVIRONMENT.CLOUDINARY.CLOUD_NAME,
  api_key: ENVIRONMENT.CLOUDINARY.API_KEY,
  api_secret: ENVIRONMENT.CLOUDINARY.API_SECRET,
});

export default cloudinary;

export function validateImages(files) {
  const allowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
  ];

  files.map((file) => {
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      throw new AppError('Invalid image type', 400);
    }
  });
}

export async function uploadFiles(files) {
  validateImages(files);

  return await Promise.all(
    files && files.length > 0
      ? files.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  { resource_type: 'auto', folder: 'products-images' },
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result.secure_url);
                    }
                  },
                )
                .end(file.buffer);
            }),
        )
      : [],
  );
}
