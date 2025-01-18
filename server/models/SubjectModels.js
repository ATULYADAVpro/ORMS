import { Schema, model } from 'mongoose';
import Department from './Department.js';

const subjectSchema = new Schema({
    stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
    sem: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, unique: true, lowercase: true },
    code: { type: String, required: true, unique: true, lowercase: true },
    credit: { type: String, required: true, lowercase: true },
    internalMax: { type: String, required: true,  lowercase: true },
    internalMin: { type: String, required: true,  lowercase: true },
    externalMax: { type: String, required: true,  lowercase: true },
    externalMin: { type: String, required: true,  lowercase: true },
    totalMin: { type: String, required: true,  lowercase: true },
    totalMax: { type: String, required: true,  lowercase: true },
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
    practicalMax: {
        type: String,
        // unique: true,
        // sparse: true, // Ensures uniqueness only for non-null values
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                if (!department) return false; // Invalid if department doesn't exist
                if (department.practical) return !!v; // If practical is true, value must exist
                return true; // Optional if practical is false
            },
            message: 'Practical max is required for departments that require practicals.',
        },
    },
    practicalCredit: {
        type: String,
        // sparse: true, // Ensures uniqueness only for non-null values
        lowercase: true,
        validate: {
            validator: async function (v) {
                const department = await Department.findById(this.stream);
                if (!department) return false; // Invalid if department doesn't exist
                if (department.practical) return !!v; // If practical is true, value must exist
                return true; // Optional if practical is false
            },
            message: 'Practical credit is required for departments that require practicals.',
        },
    },
    practicalMin: {
        type: String,
        // unique: true,
        // sparse: true, // Ensures uniqueness only for non-null values
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

const Subject = model('subject', subjectSchema);
export default Subject;
