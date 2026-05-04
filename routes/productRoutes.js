import express from 'express';
import { createProductController, getProductController, getSingleProductController } from '../controller/productController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';
import { getPriority } from 'os';

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//get products
router.get('/get-products', getProductController);

//get single product
router.get('/get-product/:slug', getSingleProductController);
export default router;