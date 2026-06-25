import express from 'express';
import { createSectionController, updateSectionController, sectionController, singleSectionController, deleteSectionController, getSectionsBySubcategoryController } from '../controller/sectionController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-section', requireSignIn, isAdmin, createSectionController);
router.put('/update-section/:id', requireSignIn, isAdmin, updateSectionController);
router.get('/get-section', sectionController);
router.get('/get-sections/:subcategoryId', getSectionsBySubcategoryController);
router.get('/single-section/:slug', singleSectionController);
router.delete('/delete-section/:id', requireSignIn, isAdmin, deleteSectionController);

export default router;