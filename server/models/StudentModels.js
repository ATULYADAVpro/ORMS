// Importing required modules
import mongoose, { Schema } from 'mongoose';

// Define the Student Schema
const studentSchema = new Schema({
    firstName: { type: String, required: true, lowercase: true },
    fatherName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    motherName: { type: String, required: true, lowercase: true },
    profileUrl: { type: String, required: true },
    dateYear: { type: Number, required: true, default: () => new Date().getFullYear() % 100 },
    rollNo: { type: String, unique: true }, // Make it optional initially
    codeId: { type: String, required: true, lowercase: true },
    prn: { type: Number, unique: true },
    mobileNo: { type: Number, required: true, unique: true },
    date_Of_year: { type: String, required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'Departments' },
    semisters: [{ type: Schema.Types.ObjectId, ref: 'Semisters' }],
}, { timestamps: true });


// pre-save middleware to generate rollNo
studentSchema.pre('save', async function (next) {
    const student = this;

    // console.log("Inside pre-save middleware");
    // console.log("Student data before generating rollNo:", student);

    if (!student.rollNo) {
        try {
            console.log("Generating rollNo...");
            const lastStudent = await mongoose.model('Student').findOne({ codeId: student.codeId, dateYear: student.dateYear }).sort({ rollNo: -1 });
            let newSequence = 1;
            if (lastStudent && lastStudent.rollNo) {
                const lastSequence = parseInt(lastStudent.rollNo.slice(-3), 10);
                newSequence = lastSequence + 1;
            }
            student.rollNo = `${student.codeId}${student.dateYear}${String(newSequence).padStart(3, '0')}`;
            // console.log("Generated rollNo:", student.rollNo);
            next();
        } catch (error) {
            console.log("Error generating rollNo:", error);
            next(error);
        }
    } else {
        next();
    }
});


// Export the Student model
const Student = mongoose.model('Student', studentSchema);
export default Student;
