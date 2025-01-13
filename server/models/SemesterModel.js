import { Schema, model } from 'mongoose';

// Create Semester Schema with Conditional Practical Validation
const semesterSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'student', required: true },
    stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'marks', required: true }],
    sem: { type: String, required: true },
    date_of_issue: { type: String, required: true },
    examType: { type: String, required: true },
    sgpa: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    grade: { type: String, default: 'F' },
    status: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
});

semesterSchema.methods.calculateSGPA = function (subjectArray) {
    // console.log("calculateSGPA method called"); // Log to check if method is invoked
    let CG = 0;
    let CREDIT = 0;
    this.success = true; // Reset success to true at the start

    for (const sub of subjectArray) {
        // console.log(`Processing subject: ${JSON.stringify(sub)}`); // Log subject details
        if (typeof sub.CPA === 'number' && typeof sub.credit === 'number') {
            if (sub.grade === 'F' || sub.practicalGrade === 'F') {
                this.grade = 'F';
                this.success = false;
                // Do not return; continue processing
            }

            if ('practicalCredit' in sub) {
                // console.log(`practicalCredit exists: ${sub.practicalCredit}`); // Log practical credit existence
                if (typeof sub.practicalCredit === 'number') {
                    CREDIT += sub.practicalCredit;
                    CG += sub.practicalCPA;
                    
                    // console.log(`Added practical credit: ${sub.practicalCredit}`); // Log practical credit addition
                } 
                // else {
                //     // console.log(`practicalCredit is not a number: ${sub.practicalCredit}`); // Log practical credit type issue
                // }
            } else {
                // console.log(`practicalCredit does not exist`); // Log practical credit non-existence
            }
            CG += sub.CPA;
            CREDIT += sub.credit;
            // console.log(`Added credit: ${sub.credit}`); // Log credit addition
        } else {
            this.success = false;
            // Do not return; continue processing
        }
    }

    this.credit = CREDIT || 0;
    this.score = CG || 0;

    if (CREDIT > 0) {
        this.sgpa = CG / CREDIT;

        if (this.sgpa >= 10) {
            this.grade = 'O';
        } else if (this.sgpa >= 9) {
            this.grade = 'A+';
        } else if (this.sgpa >= 8) {
            this.grade = 'A';
        } else if (this.sgpa >= 7) {
            this.grade = 'B+';
        } else if (this.sgpa >= 6) {
            this.grade = 'B';
        } else if (this.sgpa >= 5) {
            this.grade = 'C';
        } else if (this.sgpa >= 4) {
            this.grade = 'D';
        } else {
            this.grade = 'F';
        }
        this.success = this.success && true; // Maintain success if true
        // Log success
    } else {
        this.sgpa = 0;
        this.success = false;
        this.grade = 'F';
        // Log failure
    }

    // Log completion
};

const Semester = model('semester', semesterSchema);
export default Semester;
