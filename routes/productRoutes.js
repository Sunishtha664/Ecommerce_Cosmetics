import express from 'express';
import { createProductController } from '../controller/productController';

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, createProductController);

export default router;