// -------------- Importing Part ----------
import { Schema, model } from 'mongoose';
import Department from './DepartmentModel.js'; // Import Department model

// --------------> Create Semester Schema with Conditional Practical Validation <-------------
const semisterSchema = new Schema({
    sem: { type: String, required: true },
    date_of_issue: {
        type: Date,
        required: true,
        get: (date) => date ? date.toISOString().split('T')[0] : null
    },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    subjects: [
        {
            subjectCode: { type: String, required: true },
            subjectName: { type: String, required: true },
            internalMark: { type: Number, required: true },
            externalMark: { type: Number, required: true },
            practicalCode: {
                type: String,
                validate: {
                    validator: async function (v) {
                        const department = await Department.findById(this.stream);
                        return department && department.requirePractical ? v != null : true;
                    },
                    message: 'Practical code is required for departments with practicals'
                }
            },
            practicalName: {
                type: String,
                validate: {
                    validator: async function (v) {
                        const department = await Department.findById(this.stream);
                        return department && department.requirePractical ? v != null : true;
                    },
                    message: 'Practical name is required for departments with practicals'
                }
            },
            practicalMark: {
                type: Number,
                validate: {
                    validator: async function (v) {
                        const department = await Department.findById(this.stream);
                        return department && department.requirePractical ? v != null : true;
                    },
                    message: 'Practical mark is required for departments with practicals'
                }
            }
        }
    ],
    sgpa: { type: Number },
    credit: { type: Number },
    score: { type: Number },
});

const Semister = model('Semister', semisterSchema);
export default Semister;
