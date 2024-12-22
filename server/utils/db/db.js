// --------- Importing Part ----------
import mongoose from 'mongoose'
import { DB_URL } from '../configs/index.js';


// --------- Logic Part ----------
const connectDb = async () => {
    try {
        await mongoose.connect(DB_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            family: 4, // Forces the use of IPv4 to avoid IPv6 issues
        });
        console.log('Database connected successfully.')
    } catch (error) {
        console.log("Database connection failed: ", error);
    }
}


// --------- Exporting Part ----------
export default connectDb;