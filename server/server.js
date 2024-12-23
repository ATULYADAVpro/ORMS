// --------- Importing Part ----------
import express from 'express';
import { PORT } from './utils/configs/index.js';
import userRouter from './routers/UserRouter.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routers/authRouter.js';
import connectDb from './utils/db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Include cookies if needed
  };
  

  
// ------- Middlewares useing -------
app.use(express.json()); //->  parse json body middleware 
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)




// ------- Global Middleware for errorHandler -----
app.use(errorHandler)
// ------- SERVER CALL TO START ------
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server start at http://localhost:${PORT}`)
    })
})