// -------------- Importing Part ----------
import { Schema, model } from 'mongoose';

// --------------> Create Semester Schema with Conditional Practical Validation <-------------
const semesterSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'student', required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'subject', required: true }],

    sem: { type: String, required: true },
    date_of_issue: { type: String, required: true },
    examType: { type: String, required: true },
    
    sgpa: { type: Number },
    credit: { type: Number },
    score: { type: Number },
    status: { type: Boolean },
});

const Semester = model('semester', semesterSchema);
export default Semester;
