// ============= Importing  ==============
import { Router } from 'express'
import semesterController from '../controllers/semester/semesterController.js';
const semesterRouter = Router();

// ============= Routes of Semester  ==============
semesterRouter.post("/addSemester",semesterController.addSemester)


// ============= Routes of Semester exports ==============
export default semesterRouter