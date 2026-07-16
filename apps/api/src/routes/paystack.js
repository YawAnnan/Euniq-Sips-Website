import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import logger from '../utils/logger.js';

const router = express.Router();

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;;

// POST /paystack/initialize - Initialize Paystack transaction
router.post('/initialize', async (req, res) => {
  const { amount, email, reference, customerName } = req.body;

  // Validate required fields
  if (!amount || !email || !reference) {
    return res.status(400).json({ error: 'amount, email, and reference are required' });
  }

  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }

  // Call Paystack API to initialize transaction
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      amount: Math.round(amount * 100),
      email,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/success`,      metadata: customerName ? { customerName } : {},
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.data.status) {
    throw new Error(`Paystack initialization failed: ${response.data.message}`);
  }

  const { authorization_url, access_code } = response.data.data;

  logger.info(`Paystack transaction initialized: ${reference}`);

  res.json({
    accessCode: access_code,
    authorizationUrl: authorization_url,
    reference,
  });
});

// POST /paystack/verify - Verify Paystack payment
router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        error: 'reference is required'
      });
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    console.log('Paystack Response:', response.data);

    if (!response.data.status) {
      return res.status(400).json({
        error: response.data.message
      });
    }

    const transactionData = response.data.data;

    if (transactionData.status !== 'success') {
      return res.status(400).json({
        error: `Payment status: ${transactionData.status}`
      });
    }

    return res.json({
      status: transactionData.status,
      amount: transactionData.amount / 100,
      email:
        transactionData.customer?.email ||
        transactionData.metadata?.customerName ||
        '',
      reference: transactionData.reference,
      orderStatus: 'Payment Verified'
    });

  } catch (error) {
    console.error(
      'Verification Error:',
      error.response?.data || error.message || error
    );

    return res.status(500).json({
      error:
        error.response?.data?.message ||
        error.message ||
        'Verification failed'
    });
  }
});

export default router;