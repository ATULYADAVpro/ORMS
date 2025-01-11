// ============= Importing  ==============
import { Router } from 'express'
import markController from '../controllers/mark/markController.js';
const markRouter = Router();

// ============= Routes of Department  ==============
markRouter.put("/updateMark",markController.updateMark)


// ============= Routes of Department exports ==============
export default markRouter