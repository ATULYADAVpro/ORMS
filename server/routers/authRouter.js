
import { Router } from 'express'
import authController from '../controllers/auth/authController.js';
import verifyToken from '../middleware/authMiddleware.js';
const authRouter = Router();



authRouter.post("/register",authController.register)
authRouter.post("/login",authController.login)
authRouter.post("/loginWithOtp",authController.loginOtp)
authRouter.post("/sendOtp",authController.sendOtp)
authRouter.post("/logout",authController.logout)
authRouter.get('/checkAuth',verifyToken,authController.checkUser)

export default authRouter;