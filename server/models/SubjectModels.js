import { Schema, model } from 'mongoose';
import Department from './Department.js';

const subjectSchema = new Schema({
    stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
    sem: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, unique: true, lowercase: true },
    code: { type: String, required: true, unique: true, lowercase: true },
    practicalName: {
        type: String,
        unique: true,
        sparse: true, // Ensures uniqueness only for non-null values
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                if (!department) return false; // Invalid if department doesn't exist
                if (department.practical) return !!v; // If practical is true, value must exist
                return true; // Optional if practical is false
            },
            message: 'Practical name is required for departments that require practicals.',
        },
    },
    practicalCode: {
        type: String,
        unique: true,
        sparse: true, // Ensures uniqueness only for non-null values
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                if (!department) return false; // Invalid if department doesn't exist
                if (department.practical) return !!v; // If practical is true, value must exist
                return true; // Optional if practical is false
            },
            message: 'Practical code is required for departments that require practicals.',
        },
    },
}, { timestamps: true });

const Subject = model('Subject', subjectSchema);
export default Subject;
