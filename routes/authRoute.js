import express from 'express';
import { registerController, loginController } from '../controller/authController.js';

//router object
const router = express.Router();

//routing
//Register || method post
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController);
export default router;