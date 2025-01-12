async getStudentHaveSemester(req, res, next) {
    try {
        const { admissionDate, examType, stream, date_of_issue, sem, subjectId } = req.body;
        const filterData = [];

        const semesters = await Semester.find({
            examType,
            stream: new mongoose.Types.ObjectId(stream), // Correct comparison of ObjectId
            date_of_issue,
            sem
        }).populate("student").populate("subjects");

        for (const element of semesters) {
            if (!element.subjects || element.subjects.every(sub => mongoose.Types.ObjectId(sub.subjectId).toString() !== mongoose.Types.ObjectId(subjectId).toString())) {
                filterData.push(element);
            }
        }

        return res.status(200).json(filterData);
    } catch (error) {
        return next(error);
    }
}


import { updateStudentData } from '../../../api/api'; // Import your update API function

const { mutate: updateStudentDataMutate } = useMutation(updateStudentData, {
    onSuccess: (data) => {
        toast.success('Successfully updated student data.');
        // Optionally update your local state here if needed
    },
    onError: (error) => {
        toast.error(error.message);
    },
});

function handleUpdate() {
    if (!selectedUser) return;

    const updatedData = {
        ...selectedUser,
        internal: parseInt(document.querySelector('input[name="internal"]').value, 10),
        external: parseInt(document.querySelector('input[name="external"]').value, 10),
        credit: parseInt(document.querySelector('input[name="credit"]').value, 10),
        practicalMark: parseInt(document.querySelector('input[name="practicalMark"]').value, 10),
        practicalCredit: parseInt(document.querySelector('input[name="practicalCredit"]').value, 10),
    };

    updateStudentDataMutate(updatedData);
}


@media print {
    /* Hide everything except the specific div with id 'printable' */
    body * {
        visibility: hidden;
    }
    
    #printable {
        visibility: visible; /* Show the content of the div */
        background-color: #fff;
        color: #000;
    }
  
    /* Optional: Adjust styling for better print layout */
    #printable table {
        width: 100%;
        border-collapse: collapse;
    }

    #printable th, td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
    }
  
    /* Hide the print button during print */
    button {
        display: none;
    }
}

async generateResultNow(req, res, next) {
    const students = req.body;
    console.log(students); // Log the students array
    try {
        for (const std of students) {
            const semester = await Semester.findById(std._id).populate("subjects");
            if (!semester) {
                console.log(`Semester not found for student ID: ${std._id}`);
                continue;
            }

            // Update status field to true
            semester.status = true;

            // Ensure subjects array is populated
            if (!Array.isArray(semester.subjects) || semester.subjects.length === 0) {
                console.log(`No subjects found for student ID: ${std._id}`);
                continue;
            }

            // Log subjects before calling calculateSGPA
            console.log(`Subjects for student ID: ${std._id}`, semester.subjects);

            // Assuming calculateSGPA is a method in the Semester model
            try {
                semester.calculateSGPA(semester.subjects);
                await semester.save();
                console.log(`Results saved successfully for student ID: ${std._id}`);
            } catch (calculationError) {
                console.error(`Error calculating SGPA for student ID: ${std._id}`, calculationError);
                continue;
            }
        }
        res.status(200).json({ message: "Results generated successfully" });
    } catch (error) {
        console.error("Error generating results", error);
        return next(error);
    }
}

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
        this.sgpa = 0;
        this.success = false;
        this.grade = 'F';
    }

    console.log("SGPA calculation method works");
};

const Semester = model('semester', semesterSchema);
export default Semester;






async generateResultNow(req, res, next) {
    const studentIds = req.body;
    console.log("Student IDs array:", studentIds);
    try {
        for (const id of studentIds) {
            const semester = await Semester.findById(id).populate("subjects");
            if (!semester) {
                console.log(`Semester not found for student ID: ${id}`);
                continue;
            }

            // Update status field to true
            semester.status = true;

            // Ensure subjects array is populated
            if (!Array.isArray(semester.subjects) || semester.subjects.length === 0) {
                console.log(`No subjects found for student ID: ${id}`);
                continue;
            }

            // Log subjects before calling calculateSGPA
            console.log(`Subjects for student ID: ${id}`, semester.subjects);

            // Assuming calculateSGPA is a method in the Semester model
            try {
                semester.calculateSGPA(semester.subjects);
                await semester.save();
                console.log(`Results saved successfully for student ID: ${id}`);
            } catch (calculationError) {
                console.error(`Error calculating SGPA for student ID: ${id}`, calculationError);
                continue;
            }
        }
        res.status(200).json({ message: "Results generated successfully" });
    } catch (error) {
        console.error("Error generating results", error);
        return next(error);
    }
}

semesterSchema.methods.calculateSGPA = function (subjectArray) {
    console.log("calculateSGPA method called"); // Log to check if method is invoked
    let CG = 0;
    let CREDIT = 0;
    console.log(subjectArray); // Log subjects to see their details

    for (const sub of subjectArray) {
        if (typeof sub.CPA === 'number' && typeof sub.credit === 'number') {
            if (sub.grade === 'F' || sub.practicalGrade === 'F') {
                this.grade = 'F';
                this.success = false;
                console.log("Grade set to F due to failing grade"); // Log the condition
                return;
            }

            CG += sub.CPA;
            CREDIT += sub.credit;
            if (sub.hasOwnProperty('practicalCredit') && typeof sub.practicalCredit === 'number') {
                CREDIT += sub.practicalCredit;
            }
        } else {
            this.success = false;
            console.log("Invalid CPA or credit value in subject"); // Log the condition
            return;
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
        this.success = true;
        console.log("SGPA calculation successful"); // Log success
    } else {
        this.sgpa = 0;
        this.success = false;
        this.grade = 'F';
        console.log("SGPA calculation failed due to zero credits"); // Log failure
    }

    console.log("calculateSGPA method completed"); // Log completion
};
