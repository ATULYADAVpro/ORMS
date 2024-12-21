// -------------- Importing Part ----------
import { Schema, model } from 'mongoose';

// --------------> Create Schema <-------------

const studentSchema = new Schema({
    firstName: { type: String, required: true, lowercase: true },
    fatherName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    motherName: { type: String, required: true, lowercase: true },
    profileUrl: { type: String, required: true },
    dateYear: { type: Number, required: true, default: () => new Date().getFullYear() % 100 },
    rollNo: { type: String, required: true, unique: true },
    codeId: { type: String, required: true, lowercase: true },
    prn: { type: Number, required: true, unique: true },
    date_Of_year: { type: Date, required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'Departments' },
    semisters: [{ type: Schema.Types.ObjectId, ref: 'Semisters' }],



}, { timestamps: true })


const Student = model('Student', studentSchema);
export default Student;

// ----------> pre-save middleware to generate userId <-----------
studentSchema.pre('save', async function (next) {
    const student = this;

    // if user not exist
    if (!student.rollNo) {
        try {
            const lastStudent = await mongoose.model('Student').findOne({ codeId: student.codeId, dateYear: student.dateYear }).sort({ rollNo: -1 });
            let newSequence = 1;
            if (lastStudent && lastStudent.rollNo) {
                const lastSequence = parseInt(lastStudent.rollNo.slice(-3), 10);
                newSequence = lastSequence + 1; // Increment the sequence
            }
            // Generate new userId by combining codeId, dateYear, and incremented sequence
            student.rollNo = `${student.codeId}${student.dateYear}${String(newSequence).padStart(3, '0')}`;
            next();


        } catch (error) {
            next();
        }
    } else {
        next();
    }
})
