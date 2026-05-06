import express from 'express';
import { subcategoryController, createSubcategoryController, deleteSubcategoryController, singleSubcategoryController, updateSubcategoryController, getSubcategoriesByCategoryController } from '../controller/subcategoryController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();


//routes
//create subcategory
router.post('/create-subcategory', requireSignIn, isAdmin, createSubcategoryController);

//update subcategory
router.put('/update-subcategory/:id', requireSignIn, isAdmin, updateSubcategoryController);

//getAll subcategory
router.get('/get-subcategory', subcategoryController);

//get subcategories by category
router.get('/get-subcategories/:categoryId', getSubcategoriesByCategoryController);

//single subcategory
router.get('/single-subcategory/:slug', singleSubcategoryController);

//delete subcategory
router.delete('/delete-subcategory/:id', requireSignIn, isAdmin, deleteSubcategoryController);
export default router;