import { Router } from 'express';
import userController from '../controllers/users/userController.js'
const userRouter = Router();

userRouter.get("/",userController.demo)


export default userRouter;