import { Schema, model } from 'mongoose';
import Department from './DepartmentModel.js'; // Import the Department model

// --------------> Create Schema <-------------
const subjectSchema = new Schema({
    stream: { type: Schema.Types.ObjectId, ref: 'Departments', required: true },
    sem: { type: String, required: true, lowercase: true },
    subjectName: { type: String, required: true, unique: true, lowercase: true },
    subjetcode: { type: String, required: true, unique: true, lowercase: true },
    practicalName: {
        type: String,
        unique: true,
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                return department && department.requirePractical ? v != null : true;
            },
            message: 'Practical is required for departments that require practicals.'
        }
    },
    practicalCode: {
        type: String,
        unique: true,
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                return department && department.requirePractical ? v != null : true;
            },
            message: 'Practical code is required for departments that require practicals.'
        }
    }
}, { timestamps: true });

const Subject = model('Subject', subjectSchema);
export default Subject;
