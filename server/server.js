// --------- Importing Part ----------
import express from 'express';
import { PORT } from './utils/configs/index.js';
import userRouter from './routers/UserRouter.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routers/authRouter.js';
import connectDb from './utils/db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import departmentRouter from './routers/departmentRouter.js';
import subjectRouter from './routers/SubjectRouter.js';
import studentRouter from './routers/StudentRouter.js';
import semesterRouter from './routers/semesterRouter.js';
import markRouter from './routers/markRouter.js';
const app = express();

const corsOptions = {
    origin: process.env.FRONT_END_PORT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Include cookies if needed
};



// ------- Middlewares useing -------
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json()); //->  parse json body middleware 
app.use(cookieParser());
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api', departmentRouter)
app.use('/api/subject', subjectRouter)
app.use('/api/student', studentRouter)
app.use('/api/semester', semesterRouter)
app.use('/api/marks', markRouter)





// ------- Global Middleware for errorHandler -----
app.use(errorHandler)
// ------- SERVER CALL TO START ------
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server start at http://localhost:${PORT}`)
    })
})