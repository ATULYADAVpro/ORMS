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

markSchema.pre('save', function(next) {
  this.totalMark = this.internal + this.external;

  console.log(`Total Mark: ${this.totalMark}`);

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

  console.log(`Grade: ${this.grade}, Grade Point: ${this.gradePoint}`);

  this.CPA = calculateCPA(this.gradePoint, this.credit);
  console.log(`CPA: ${this.CPA}`);

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
    console.log(`Practical Grade: ${this.practicalGrade}, Practical Grade Point: ${this.practicalGradePoint}, Practical CPA: ${this.practicalCPA}`);
  } else {
    this.practicalGrade = null;
    this.practicalGradePoint = null;
    this.practicalCPA = null;
  }

  next();
});

function calculateCPA(gradePoint, credit) {
  return gradePoint * credit;
}

const Marks = model('marks', markSchema);

export default Marks;


import style from './semisterDataForSD.module.css';

export default function SemisterDataForSD({ data, semData }) {
    const renderSubjectRow = (sub, i) => (
        <tr key={i}>
            <td>{sub.subjectCode}</td>
            <td>{sub.subjectName}</td>
            <td></td>
            <td></td>
            <td>{sub.internal}</td>
            <td></td>
            <td></td>
            <td>{sub.external}</td>
            <td></td>
            <td></td>
            <td>{sub.totalMark}</td>
            <td>{sub.grade}</td>
            <td>{sub.gradePoint}</td>
            <td>{sub.credit}</td>
            <td>{sub.CPA}</td>
            {i === 0 && <td rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>{data.sgpa}</td>}
        </tr>
    );

    const renderPracticalRow = (sub, i) => (
        <tr key={`practical-${i}`}>
            <td>{sub.practicalCode}</td>
            <td>{sub.practicalName}</td>
            <td></td>
            <td></td>
            <td>-</td>
            <td></td>
            <td></td>
            <td>{sub.practicalMark}</td>
            <td></td>
            <td></td>
            <td>{sub.practicalMark}</td>
            <td>{sub.practicalGrade}</td>
            <td>{sub.practicalGradePoint}</td>
            <td>{sub.practicalCredit}</td>
            <td>{sub.practicalCPA}</td>
        </tr>
    );

    const creditEarnSemWaise = {
        sem1: [],
        sem2: [],
        sem3: [],
        sem4: [],
    };

    semData.forEach((data) => {
        const entry = {
            credit: data.credit,
            examType: data.examType,
            date_of_issue: data.date_of_issue
        };

        if (data.sem === "1") {
            creditEarnSemWaise.sem1.push(entry);
        }
        if (data.sem === "2") {
            creditEarnSemWaise.sem2.push(entry);
        }
        if (data.sem === "3") {
            creditEarnSemWaise.sem3.push(entry);
        }
        if (data.sem === "4") {
            creditEarnSemWaise.sem4.push(entry);
        }
    });

    console.log(creditEarnSemWaise);

    return (
        <div>
            <br />
            <hr />
            <div className={style.header}>
                <div>
                    <h1>Sem No</h1>
                </div>
                <div>
                    <button className={style.btnPrint}>Print</button>
                </div>
            </div>
            <hr />
            {/* result data */}
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th rowSpan={"2"}>Code</th>
                        <th rowSpan={"2"}>Name</th>
                        <th colSpan={"3"}>Internal</th>
                        <th colSpan={"3"}>External</th>
                        <th colSpan={"3"}>Total</th>
                        <th rowSpan={"2"}>Grade</th>
                        <th rowSpan={"2"}>Grade Points</th>
                        <th rowSpan={"2"}>Credit Points</th>
                        <th rowSpan={"2"}>CxG</th>
                        <th rowSpan={data.subjects.length + (data.stream.practical ? data.subjects.length : 0)}>SGPI</th>
                    </tr>
                    <tr>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Obt</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.subjects.map((sub, i) => renderSubjectRow(sub, i))}
                    {data.stream.practical && data.subjects.map((sub, i) => renderPracticalRow(sub, i))}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Remark: {data.success === true ? "Successful" : "fail"}</th>
                        <th>Credit Earned: {data.credit}</th>
                        <th>Total Credit: {data.credit}</th>
                        <th>C*G: {data.score}</th>
                        <th>SGPI: {data.sgpa}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Credit Earned sem 1: {creditEarnSemWaise.sem1.map(entry => `${entry.credit} (Exam: ${entry.examType}, Date: ${entry.date_of_issue})`).join(', ')}</td>
                        <td>Credit Earned sem 2: {creditEarnSemWaise.sem2.map(entry => `${entry.credit} (Exam: ${entry.examType}, Date: ${entry.date_of_issue})`).join(', ')}</td>
                        <td>Credit Earned sem 3: {creditEarnSemWaise.sem3.map(entry => `${entry.credit} (Exam: ${entry.examType}, Date: ${entry.date_of_issue})`).join(', ')}</td>
                        <td>Credit Earned sem 4: {creditEarnSemWaise.sem4.map(entry => `${entry.credit} (Exam: ${entry.examType}, Date: ${entry.date_of_issue})`).join(', ')}</td>
                        <td>Grade: {data.grade}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
