import express from 'express';
import { createProductController } from '../controller/productController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, createProductController);

export default router;