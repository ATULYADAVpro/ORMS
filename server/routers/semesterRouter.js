// ============= Importing  ==============
import { Router } from 'express'
import semesterController from '../controllers/semester/semesterController.js';
const semesterRouter = Router();

// ============= Routes of Semester  ==============
semesterRouter.post("/addSemester", semesterController.addSemester)
semesterRouter.get("/getSemester", semesterController.getSemester)
semesterRouter.post("/semesterActive", semesterController.semesterActive)
semesterRouter.post("/addSubjectInSemester", semesterController.addSubjectInSemester)
semesterRouter.post("/addSemesterinBulk", semesterController.addSemesterinBulk)
semesterRouter.post("/addSubjectsInSemesterBulk", semesterController.addSubjectsInSemesterBulk)


// ============= Routes of Semester exports ==============
export default semesterRouter