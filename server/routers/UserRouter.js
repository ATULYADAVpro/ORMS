import { Router } from 'express';
import userController from '../controllers/users/userController.js'
const userRouter = Router();

userRouter.get("/",userController.demo)
userRouter.get("/getUsers",userController.getUser)

export default userRouter;