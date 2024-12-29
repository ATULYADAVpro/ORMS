// ============= Importing =========
import {Router} from 'express'
import subjectController from '../controllers/subjects/subject.js';
const subjectRouter = Router();
// ============ Routers ========

subjectRouter.post('/addSubject',subjectController.addSubject)
subjectRouter.get('/getSubject',subjectController.getSubject)
subjectRouter.get('/getAllSubject',subjectController.getAllSubject)
subjectRouter.put("/subjectUpdate",subjectController.subjectUpdate)
subjectRouter.delete("/deleteSubject/:_id",subjectController.deleteSubject)



export default subjectRouter