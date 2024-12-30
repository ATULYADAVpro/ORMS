import { Router } from 'express'
import department from '../controllers/department/department.js';
const departmentRouter = Router();



departmentRouter.post('/addDepartment',department.addDepartment)
departmentRouter.get('/getDepartment',department.getDepartment)
departmentRouter.put('/updateDepartment',department.updateDepartment)

export default departmentRouter;