// -------------- Importing Part --------------
import { Schema, model } from 'mongoose';

// --------------> Create Schema <-------------

const departmentSchema = new Schema({
    stream: { type: String, required: true, unique: true },
    code: { type: Number, required: true, unique: true },
    practical: { type: Boolean, required: true },
})

// -------------- Exporting Part -----------
const Department = model('department', departmentSchema);
export default Department;