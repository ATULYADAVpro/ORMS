// ============= Importing  ==============
import { Router } from 'express'
import studentController from '../controllers/students/studentController.js';
const studentRouter = Router();

// ============= Routes of Department  ==============
studentRouter.post("/addStudent",studentController.addStudent)
studentRouter.post("/addBulkStudents",studentController.addBulkStudents)
studentRouter.get("/getStudent",studentController.getStudent)
studentRouter.put("/updateStudent",studentController.updateStudent)
studentRouter.post("/deleteStudent",studentController.deleteStudent)
studentRouter.post("/getStudentForSemester",studentController.getStudentForSemester)
studentRouter.post("/getStudentHaveSemester",studentController.getStudentHaveSemester)
studentRouter.post("/getStudentMarkForSpecificTeacher",studentController.getStudentMarkForSpecificTeacher)



// ============= Routes of Department exports ==============
export default studentRouter;