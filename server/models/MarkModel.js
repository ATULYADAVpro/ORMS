import { Schema, model } from 'mongoose';

const markSchema = new Schema({
  semesterId: { type: Schema.Types.ObjectId, ref: 'semester', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'subject', required: true },
  subjectName: { type: String, required: true, lowercase: true },
  subjectCode: { type: String, required: true, lowercase: true },
  internal: { type: Number, required: true },
  external: { type: Number, required: true },
  credit: { type: Number, required: true },
  practicalName: { type: String, lowercase: true },
  practicalCode: { type: String, lowercase: true },
  practicalMark: { type: Number, lowercase: true },
  practicalCredit: { type: Number, lowercase: true },
  totalMark: { type: Number },
  grade: { type: String },
  gradePoint: { type: Number },
  CPA: { type: Number },
  practicalGrade: { type: String },
  practicalGradePoint: { type: Number },
  practicalCPA: { type: Number }
});

function calculateCPA(gradePoint, credit) {
  return gradePoint * credit;
}

markSchema.pre('save', function (next) {
  this.totalMark = this.internal + this.external;

  // console.log(`Total Mark: ${this.totalMark}`);

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

  // console.log(`Grade: ${this.grade}, Grade Point: ${this.gradePoint}`);

  this.CPA = calculateCPA(this.gradePoint, this.credit);
  // console.log(`CPA: ${this.CPA}`);

  if (this.practicalMark != null && this.practicalCredit != null) {
    if (this.practicalMark >= 40) {
      this.practicalGrade = 'O';
      this.practicalGradePoint = 10;
    } else if (this.practicalMark >= 35) {
      this.practicalGrade = 'A+';
      this.practicalGradePoint = 9;
    } else if (this.practicalMark >= 30) {
      this.practicalGrade = 'A';
      this.practicalGradePoint = 8;
    } else if (this.practicalMark >= 27.5) {
      this.practicalGrade = 'B+';
      this.practicalGradePoint = 7;
    } else if (this.practicalMark >= 25) {
      this.practicalGrade = 'B';
      this.practicalGradePoint = 6;
    } else if (this.practicalMark >= 22.5) {
      this.practicalGrade = 'C';
      this.practicalGradePoint = 5;
    } else if (this.practicalMark >= 20) {
      this.practicalGrade = 'D';
      this.practicalGradePoint = 4;
    } else {
      this.practicalGrade = 'F';
      this.practicalGradePoint = 0;
    }

    this.practicalCPA = calculateCPA(this.practicalGradePoint, this.practicalCredit);
    // console.log(`Practical Grade: ${this.practicalGrade}, Practical Grade Point: ${this.practicalGradePoint}, Practical CPA: ${this.practicalCPA}`);
  } else {
    this.practicalGrade = null;
    this.practicalGradePoint = null;
    this.practicalCPA = null;
  }

  next();
});

markSchema.pre('findOneAndUpdate', function (next) {
  let update = this.getUpdate();
  update.totalMark = update.internal + update.external;

  // console.log(`Total Mark: ${update.totalMark}`);

  if (update.totalMark >= 90) {
    update.grade = 'O';
    update.gradePoint = 10;
  } else if (update.totalMark >= 80) {
    update.grade = 'A+';
    update.gradePoint = 9;
  } else if (update.totalMark >= 70) {
    update.grade = 'A';
    update.gradePoint = 8;
  } else if (update.totalMark >= 60) {
    update.grade = 'B+';
    update.gradePoint = 7;
  } else if (update.totalMark >= 50) {
    update.grade = 'B';
    update.gradePoint = 6;
  } else if (update.totalMark >= 40) {
    update.grade = 'C';
    update.gradePoint = 5;
  } else if (update.totalMark >= 30) {
    update.grade = 'D';
    update.gradePoint = 4;
  } else {
    update.grade = 'F';
    update.gradePoint = 0;
  }

  // console.log(`Grade: ${update.grade}, Grade Point: ${update.gradePoint}`);

  update.CPA = calculateCPA(update.gradePoint, update.credit);
  // console.log(`CPA: ${update.CPA}`);

  if (update.practicalMark != null && update.practicalCredit != null) {
    if (update.practicalMark >= 40) {
      update.practicalGrade = 'O';
      update.practicalGradePoint = 10;
    } else if (update.practicalMark >= 35) {
      update.practicalGrade = 'A+';
      update.practicalGradePoint = 9;
    } else if (update.practicalMark >= 30) {
      update.practicalGrade = 'A';
      update.practicalGradePoint = 8;
    } else if (update.practicalMark >= 27.5) {
      update.practicalGrade = 'B+';
      update.practicalGradePoint = 7;
    } else if (update.practicalMark >= 25) {
      update.practicalGrade = 'B';
      update.practicalGradePoint = 6;
    } else if (update.practicalMark >= 22.5) {
      update.practicalGrade = 'C';
      update.practicalGradePoint = 5;
    } else if (update.practicalMark >= 20) {
      update.practicalGrade = 'D';
      update.practicalGradePoint = 4;
    } else {
      update.practicalGrade = 'F';
      update.practicalGradePoint = 0;
    }

    update.practicalCPA = calculateCPA(update.practicalGradePoint, update.practicalCredit);
    // console.log(`Practical Grade: ${update.practicalGrade}, Practical Grade Point: ${update.practicalGradePoint}, Practical CPA: ${update.practicalCPA}`);
  } else {
    update.practicalGrade = null;
    update.practicalGradePoint = null;
    update.practicalCPA = null;
  }

  next();
});




const Marks = model('marks', markSchema);

export default Marks;
