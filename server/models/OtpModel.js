// -------------- Importing Part --------------
import { Schema, model } from 'mongoose';

// --------------> Create Schema <-------------

const otpSchema = new Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
})


// Optional: Add an index to automatically delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// -------------- Exporting Part -----------
const Otp = model('Otp', otpSchema);
export default Otp;
