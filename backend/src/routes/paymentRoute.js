import express from 'express';
import { createPaymentOrder, paymentVerification } from '../controllers/paymentcontroller.js';

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', paymentVerification);

export default router;
