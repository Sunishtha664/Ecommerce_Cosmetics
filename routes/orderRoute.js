import express from 'express';
import { verifyKhaltiPaymentController, getUserOrdersController } from '../controller/orderController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/khalti/verify', requireSignIn, verifyKhaltiPaymentController);
router.get('/user-orders', requireSignIn, getUserOrdersController);

export default router;
