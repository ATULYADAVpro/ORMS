// -------------- Importing Part ----------
import { Schema, model } from 'mongoose';

// --------------> Create Semester Schema with Conditional Practical Validation <-------------
const semisterSchema = new Schema({
    sem: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'student', required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
    date_of_issue: { type: String, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'subject', required: true }],
    sgpa: { type: Number },
    credit: { type: Number },
    score: { type: Number },
});

const Semister = model('Semister', semisterSchema);
export default Semister;
