// -------------- Importing Part ----------
import mongoose, { Schema } from 'mongoose'


// --------------> Create Schema <-------------

const userSchema = new Schema({
    firstName: { type: String, required: true, lowercase: true },
    middleName: { type: String, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    profile: { type: String, required: true, },
    role: { type: String, required: true, default: 'teachar', lowercase: true },
    department: { type: String, required: true, lowercase: true },
    // password: { type: String, required: true },
    userId: { type: String, unique: true },
    codeId: { type: String, required: true, default: "TT" },
    email: { type: String, required: true, lowercase: true, unique: true },
    dateYear: { type: Number, required: true, default: () => new Date().getFullYear() % 100 },
    subjects: { sem1: [{ type: String }], sem2: [{ type: String }], sem3: [{ type: String }], sem4: [{ type: String }] },
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.userId) {  // Only generate userId if it's not already set
        try {
            // console.log("Generating userId for:", user.firstName, user.lastName);

            // Find the last user with the same codeId and dateYear
            const lastUser = await mongoose.model('User').findOne({
                codeId: user.codeId,
                dateYear: user.dateYear
            }).sort({ userId: -1 });

            let newSequence = 1;  // Default sequence value for first user

            if (lastUser && lastUser.userId) {
                // Extract sequence number from the last user's userId and increment it
                const lastSequence = parseInt(lastUser.userId.slice(-3), 10);
                newSequence = lastSequence + 1;
            }

            // Generate the userId for the new user
            user.userId = `${user.codeId}${user.dateYear}${String(newSequence).padStart(3, '0')}`;

            // console.log("Generated userId:", user.userId);  // Debugging

            // Proceed to save the document
            next();
        } catch (error) {
            console.error("Error generating userId:", error);
            next(error); // Pass error to next middleware
        }
    } else {
        next();  // If userId already exists, just proceed
    }
});



const User = mongoose.model('User', userSchema);
export default User;


// ----------> pre-save middleware to generate userId <-----------
