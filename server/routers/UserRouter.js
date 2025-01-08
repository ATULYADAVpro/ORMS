// ============= Importing  ==============
import { Router } from 'express';
import userController from '../controllers/users/userController.js'
const userRouter = Router();

// ============= Routes of Users  ==============
userRouter.get("/getUsers",userController.getUser)
userRouter.put("/updateUser",userController.updateUser)
userRouter.delete("/deleteUser/::email",userController.deleteUser)
userRouter.get("/getUserQueryBase",userController.getUserQueryBase)

// ============= Routes of Users exports ==============
export default userRouter;