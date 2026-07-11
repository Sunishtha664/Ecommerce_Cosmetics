import express from 'express';
import {
    verifyKhaltiPaymentController,
    createStripeCheckoutSessionController,
    verifyStripePaymentController,
    getUserOrdersController,
} from '../controller/orderController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/khalti/verify', requireSignIn, verifyKhaltiPaymentController);
router.post('/stripe/create-session', requireSignIn, createStripeCheckoutSessionController);
router.post('/stripe/verify', requireSignIn, verifyStripePaymentController);
router.get('/user-orders', requireSignIn, getUserOrdersController);

export default router;
