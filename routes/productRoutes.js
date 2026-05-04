import express from 'express';
import { createProductController } from '../controller/productController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

export default router;