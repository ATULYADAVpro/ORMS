// ============= Importing =========
import {Router} from 'express'
import subjectController from '../controllers/subjects/subject.js';
const subjectRouter = Router();
// ============ Routers ========

subjectRouter.post('/addSubject',subjectController.addSubject)
subjectRouter.get('/getSubject',subjectController.getSubject)



export default subjectRouter