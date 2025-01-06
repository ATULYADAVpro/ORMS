import { Model, Schema, model } from 'mongoose';

const markSchema = new Schema({
  semesterId: { type: Schema.Types.ObjectId, ref: 'semster', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'subject', required: true },
  subjectName: { type: String, required: true, lowercase: true },
  subjectCode: { type: String, required: true, lowercase: true },
  internal: { type: Number, required: true },
  external: { type: Number, required: true },
  creadit: { type: Number, required: true },
  practicalName: { type: String, lowercase: true },
  practicalCode: { type: String, lowercase: true },
  practicalMark: { type: Number, lowercase: true },
  practicalCreadit: { type: Number, lowercase: true },
  totalMark: { type: Number },
  grade: { type: String },
  gradePoint: { type: Number },
  CPA: { type: Number },
  practicalGrade: { type: String },
  practicalGradePoint: { type: Number },
  practicalCPA: { type: Number }
});

// Middleware to calculate totalMark, grade, gradePoint, CPA, practicalGrade, practicalGradePoint, and practicalCPA before saving/updating
markSchema.pre('save', function(next) {
  this.totalMark = this.internal + this.external;

  // Define your grading system here
  if (this.totalMark >= 90) {
    this.grade = 'O';
    this.gradePoint = 10;
  } else if (this.totalMark >= 80) {
    this.grade = 'A+';
    this.gradePoint = 9;
  } else if (this.totalMark >= 70) {
    this.grade = 'A';
    this.gradePoint = 8;
  } else if (this.totalMark >= 60) {
    this.grade = 'B+';
    this.gradePoint = 7;
  } else if (this.totalMark >= 50) {
    this.grade = 'B';
    this.gradePoint = 6;
  } else if (this.totalMark >= 40) {
    this.grade = 'C';
    this.gradePoint = 5;
  } else if (this.totalMark >= 30) {
    this.grade = 'D';
    this.gradePoint = 4;
  } else {
    this.grade = 'F';
    this.gradePoint = 0;
  }

  // Calculate CPA based on gradePoint and creadit
  this.CPA = calculateCPA(this.gradePoint, this.creadit);

  // Check if practicalMark and practicalCreadit exist before performing calculations
  if (this.practicalMark != null && this.practicalCreadit != null) {
    // Grading system for practical marks
    if (this.practicalMark >= 90) {
      this.practicalGrade = 'O';
      this.practicalGradePoint = 10;
    } else if (this.practicalMark >= 80) {
      this.practicalGrade = 'A+';
      this.practicalGradePoint = 9;
    } else if (this.practicalMark >= 70) {
      this.practicalGrade = 'A';
      this.practicalGradePoint = 8;
    } else if (this.practicalMark >= 60) {
      this.practicalGrade = 'B+';
      this.practicalGradePoint = 7;
    } else if (this.practicalMark >= 50) {
      this.practicalGrade = 'B';
      this.practicalGradePoint = 6;
    } else if (this.practicalMark >= 40) {
      this.practicalGrade = 'C';
      this.practicalGradePoint = 5;
    } else if (this.practicalMark >= 30) {
      this.practicalGrade = 'D';
      this.practicalGradePoint = 4;
    } else {
      this.practicalGrade = 'F';
      this.practicalGradePoint = 0;
    }

    // Calculate practical CPA based on practicalGradePoint and practicalCreadit
    this.practicalCPA = calculateCPA(this.practicalGradePoint, this.practicalCreadit);
  } else {
    this.practicalGrade = null;
    this.practicalGradePoint = null;
    this.practicalCPA = null;
  }

  next();
});

function calculateCPA(gradePoint, creadit) {
  // Calculate CPA as gradePoint * creadit
  return gradePoint * creadit;
}

const Marks = model('marks', markSchema);

export default Marks;
