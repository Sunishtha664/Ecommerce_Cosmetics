import express from 'express';
import { categoryController, createCategoryController, updateCategoryController } from '../controller/categoryController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();


//routes
//create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

//getAll category
router.get('/get-category', categoryController);

export default router;