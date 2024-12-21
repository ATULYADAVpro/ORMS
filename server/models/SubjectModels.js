// -------------- Importing Part ----------
import { Schema, model } from 'mongoose';


// --------------> Create Schema <-------------
const subjectSchema = new Schema({
    stream: { type: Schema.Types.ObjectId, ref: 'Departments' },
    sem: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, unique: true, lowercase: true },
    code: { type: String, required: true, unique: true, lowercase: true },
    practical: { type: String, unique: true, lowercase: true },
    practicalCode: { type: String, unique: true, lowercase: true },
}, { timestamps: true })


const Subject = model('Subject', subjectSchema);
export default Subject;