// ============= Importing  ==============
import { Router } from 'express'
import studentController from '../controllers/students/studentController.js';
const studentRouter = Router();

// ============= Routes of Department  ==============
studentRouter.post("/addStudent",studentController.addStudent)
studentRouter.post("/addBulkStudents",studentController.addBulkStudents)
studentRouter.get("/getStudent",studentController.getStudent)

// ============= Routes of Department exports ==============
export default studentRouter;