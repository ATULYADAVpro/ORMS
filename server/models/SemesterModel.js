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
    let CG = 0;
    let CREDIT = 0;
    console.log(subjectArray); // Log subjects to see their details
  
    for (const sub of subjectArray) {
      // Ensure that CPA and credit are numbers
      if (typeof sub.CPA === 'number' && typeof sub.credit === 'number') {
        if (sub.grade === 'F' || sub.practicalGrade === 'F') {
          this.grade = 'F';
          this.success = false;
          return;
        }
  
        CG += sub.CPA;
        CREDIT += sub.credit;
        if (sub.hasOwnProperty('practicalCredit') && typeof sub.practicalCredit === 'number') {
          CREDIT += sub.practicalCredit;
        }
      } else {
        this.success = false;
        return;
      }
    }
  
    // Set credit and score, ensuring they are numbers
    this.credit = CREDIT || 0;
    this.score = CG || 0;
  
    // Ensure CREDIT is greater than zero before division
    if (CREDIT > 0) {
      this.sgpa = CG / CREDIT;
  
      // Define your grading system here
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
      this.success = true;
    } else {
      this.sgpa = 0; // Default value if CREDIT is zero
      this.success = false;
      this.grade = 'F'; // Default failing grade
    }
  
    console.log("Method works");
  };
  

const Semester = model('semester', semesterSchema);
export default Semester;
