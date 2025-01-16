// ============= Importing  ==============
import { Router } from 'express'
import semesterController from '../controllers/semester/semesterController.js';
const semesterRouter = Router();

// ============= Routes of Semester  ==============
semesterRouter.post("/addSemester", semesterController.addSemester)
semesterRouter.get("/getSemester", semesterController.getSemester)
// semesterRouter.post("/semesterActive", semesterController.semesterActive)
semesterRouter.post("/addSubjectInSemester", semesterController.addSubjectInSemester)
semesterRouter.post("/addSemesterinBulk", semesterController.addSemesterinBulk)
semesterRouter.post("/addSubjectsInSemesterBulk", semesterController.addSubjectsInSemesterBulk)
semesterRouter.post("/getCompletedSemesterSubject", semesterController.getCompletedSemesterSubject)
semesterRouter.post("/generateResultNow", semesterController.generateResultNow)
semesterRouter.post("/getInCompletedSemesterSubject", semesterController.getInCompletedSemesterSubject)
semesterRouter.post("/getActiveSemester", semesterController.getActiveSemester)
semesterRouter.post("/getActiveSemesterForExportResult", semesterController.getActiveSemesterForExportResult)


// ============= Routes of Semester exports ==============
export default semesterRouter