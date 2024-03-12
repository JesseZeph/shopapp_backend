import * as dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 3000,
    ENV: process.env.APP_ENV,
  },
  DB: {
    URL: process.env.DATABASE_URL,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  },
  PAYSTACK: {
    PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    CALLBACK_URL: process.env.PAYSTACK_CALLBACK_URL,
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  ADMIN: {
    SECRET: process.env.ADMIN_SECRET_KEY,
  },
};
