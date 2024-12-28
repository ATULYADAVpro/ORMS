import { Router } from 'express';
import userController from '../controllers/users/userController.js'
const userRouter = Router();

userRouter.get("/",userController.demo)
userRouter.get("/getUsers",userController.getUser)
userRouter.put("/updateUser",userController.updateUser)
userRouter.delete("/deleteUser/::email",userController.deleteUser)

export default userRouter;