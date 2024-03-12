import axios from 'axios';
import { ENVIRONMENT } from '../config/environment.js';

const paystackInstance = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${ENVIRONMENT.PAYSTACK.SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const initializeTransaction = async (data) => {
  try {
    const res = await paystackInstance.post('/transaction/initialize', data);

    return res.data;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

export const verifyTransaction = async (reference) => {
  try {
    const res = await paystackInstance.get(`/transaction/verify/${reference}`);

    
    return res.data;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};
