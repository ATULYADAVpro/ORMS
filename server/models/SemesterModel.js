import { Schema, model } from 'mongoose';

// Create Semester Schema with Conditional Practical Validation
const semesterSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'student', required: true },
  stream: { type: Schema.Types.ObjectId, ref: 'department', required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'marks', required: true }],
  sem: { type: String, required: true },
  date_of_issue: { type: String, required: true},
  examType: { type: String, required: true},
  sgpa: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  grade: { type: String, default: 'F' },
  status: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
});

semesterSchema.methods.calculateSGPA = function (subjectArray) {
  console.log("calculateSGPA method called"); // Log to check if method is invoked
  let CG = 0;
  let CREDIT = 0;
  this.success = true; // Reset success to true at the start

  for (const sub of subjectArray) {
      if (typeof sub.CPA === 'number' && typeof sub.credit === 'number') {
          if (sub.grade === 'F' || sub.practicalGrade === 'F') {
              this.grade = 'F';
              this.success = false;
              // console.log("Grade set to F due to failing grade"); // Log the condition
              // Do not return; continue processing
          }

          CG += sub.CPA;
          CREDIT += sub.credit;
          if (sub.hasOwnProperty('practicalCredit') && typeof sub.practicalCredit === 'number') {
              CREDIT += sub.practicalCredit;
          }
      } else {
          this.success = false;
          // console.log("Invalid CPA or credit value in subject"); // Log the condition
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
      // console.log("SGPA calculation successful"); // Log success
  } else {
      this.sgpa = 0;
      this.success = false;
      this.grade = 'F';
      // console.log("SGPA calculation failed due to zero credits"); // Log failure
  }

  // console.log("calculateSGPA method completed"); // Log completion
};


  

const Semester = model('semester', semesterSchema);
export default Semester;
