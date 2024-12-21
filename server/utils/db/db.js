// --------- Importing Part ----------
import mongoose from 'mongoose'
import { DB_URL } from '../configs/index.js';


// --------- Logic Part ----------
const connectDb = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Database connected successFull.')
    } catch (error) {
        console.log("database failed: ")
    }
}


// --------- Exporting Part ----------
export default connectDb;