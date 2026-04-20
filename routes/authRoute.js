import express from 'express';
import { registerController, loginController, testController } from '../controller/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//router object
const router = express.Router();

//routing
//Register || method post
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController);

//test route
router.get('/test', requireSignIn, isAdmin, testController);

//protected route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});
export default router;