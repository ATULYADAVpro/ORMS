// ============= Importing  ==============
import { Router } from 'express'
import department from '../controllers/department/department.js';
const departmentRouter = Router();

// ============= Routes of Department  ==============
departmentRouter.post('/addDepartment',department.addDepartment)
departmentRouter.get('/getDepartment',department.getDepartment)
departmentRouter.get('/getDepartmentById/:_id',department.getDepartmentById)
departmentRouter.put('/updateDepartment',department.updateDepartment)
departmentRouter.delete('/deleteDepartment/:_id',department.deleteDepartment)

// ============= Routes of Department exports ==============
export default departmentRouter;