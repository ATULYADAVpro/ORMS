import Joi from "joi";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Student from "../../models/StudentModels.js";
import Semester from "../../models/SemesterModel.js";
import moment from "moment"; // Import moment for date handling
import Subject from "../../models/SubjectModels.js";
import Marks from "../../models/MarkModel.js";

const semesterController = {

    // -------------- add semester ------------
    async addSemester(req, res, next) {
        try {
            // ------- Validation ------
            const semesterSchema = Joi.object({
                sem: Joi.string().required(),
                student: Joi.string().required(),
                date_of_issue: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).required(),
                examType: Joi.string().required()
            });
            const { value, error } = semesterSchema.validate(req.body);
            if (error) { return next(error); }

            // Format the date_of_issue to "DD-MM-YYYY"
            value.date_of_issue = moment(value.date_of_issue, "DD-MM-YYYY").format("DD-MM-YYYY");

            // ------------- Verify Student Exists ------
            const studentExist = await Student.findById(value.student).select('_id firstName rollNo semesters stream');
            if (!studentExist) { return next(CustomErrorHandler.notFound("Student not Found")); }

            // ----------------- Verify Semester Exists ------
            const semesterExist = await Semester.findOne({ sem: value.sem, student: value.student, date_of_issue: value.date_of_issue }).select('_id');
            if (semesterExist) { return next(CustomErrorHandler.AlreadyExists("This student already has this semester")); }

            // ------------ Add Semester Details in DB ------------
            const addSemesterData = new Semester({
                stream: studentExist.stream,
                ...value
            });
            await addSemesterData.save();

            // ------- Add Semester ID to Student's Semester Field ----
            studentExist.semesters = studentExist.semesters.concat(addSemesterData._id);
            await studentExist.save();

            res.status(200).json({ success: true, message: `Successfully added semester for ${studentExist.firstName}`, addSemesterData });

        } catch (error) {
            return next(error);
        }
    },

    // ----------- Get Semester -----------
    async getSemester(req, res, next) {
        try {
            const semester = await Semester.find({})
            if (!semester) { return next(CustomErrorHandler.notFound("Semester are empty or not found")) }
            res.status(200).json({ message: "Successfull Getting semester ", semester })

        } catch (error) {
            return next(error)
        }
    },

    // --------------- Do active status --------
    async semesterActive(req, res, next) {
        try {
            const { _id, sem, stream } = req.body;
            const semester = await Semester.findById(_id).populate({ path: "subjects" });
            const subjects = await Subject.find({ sem, stream });

            let leftSubjects = []; // Initialize as an array to store all unmatched subjects

            // Match subjectId
            const semesterSubjectIds = semester.subjects.map(sems => String(sems.subjectId));

            for (const sub of subjects) {
                if (!semesterSubjectIds.includes(String(sub._id))) {
                    leftSubjects.push(sub); // Add unmatched subjects to the array
                }
            }

            if (leftSubjects.length > 0) {
                // Return message if there are unmatched subjects
                return res.status(400).json({ message: `Some subjects are not submitted left ${leftSubjects.length}, contact your teacher`, leftSubjects });
            } else {
                // Update status field to true if all subjects are submitted
                semester.status = true;
                await semester.save();
                return res.status(200).json({ message: "All subjects submitted successfully and status updated", semester });
            }
        } catch (error) {
            return next(error);
        }
    },


    // --------------- Do active status for multiple students --------
    async semesterActiveBulk(req, res, next) {
        try {
            const { students } = req.body; // Assuming 'students' is an array of student data

            let results = []; // Initialize an array to store results for each student

            for (const student of students) {
                const { _id, sem, stream } = student;
                const semester = await Semester.findById(_id).populate({ path: "subjects" });
                const subjects = await Subject.find({ sem, stream });

                let leftSubjects = []; // Initialize as an array to store all unmatched subjects

                // Match subject code or _id
                const semesterSubjectIds = semester.subjects.map(sems => String(sems.subjectId));

                for (const sub of subjects) {
                    if (!semesterSubjectIds.includes(String(sub._id))) {
                        leftSubjects.push(sub); // Add unmatched subjects to the array
                    }
                }

                if (leftSubjects.length > 0) {
                    // Store result if there are unmatched subjects
                    results.push({ studentId: _id, message: `Some subjects are not submitted left ${leftSubjects.length}, contact your teacher`, leftSubjects });
                } else {
                    // Update status field to true if all subjects are submitted
                    semester.status = true;
                    await semester.save();
                    results.push({ studentId: _id, message: "All subjects submitted successfully and status updated", semester });
                }
            }

            // Return results for all students
            return res.status(200).json({ results });

        } catch (error) {
            return next(error);
        }
    },


    // ------------------------- for teachar subject permission related add subject functionalty ------
    async addSubjectInSemester(req, res, next) {
        try {
            const { semesterDetails, markDetails } = req.body;

            // Find the semester
            const semester = await Semester.findOne({
                sem: semesterDetails.sem,
                stream: semesterDetails.stream,
                student: semesterDetails.student,
                date_of_issue: semesterDetails.date_of_issue
            }).populate({ path: "subjects" });

            if (!semester) {
                return next(CustomErrorHandler.notFound("Semester not found"));
            }

            // const subjectSchema = await Subject.findById(markDetails.subjectId)


            // Verify if the subject already exists (case-insensitive check)
            const subjectExist = semester.subjects.some((subject) =>
                subject.subjectCode.toLowerCase() === markDetails.subjectCode.toLowerCase()
            );

            if (subjectExist) {
                return next(CustomErrorHandler.AlreadyExists("This subject already added"));
            }

            // Create Mark entry
            const submitMark = new Marks({
                semesterId: semester._id,
                ...markDetails
            });

            // Save the new mark entry
            await submitMark.save();

            // Add the new mark ID to the semester's subjects array
            semester.subjects.push(submitMark._id);

            // Save the updated semester
            await semester.save();

            res.status(200).json({ success: true, message: "Successfully added subject", submitMark });
        } catch (error) {
            return next(error);
        }
    },








};

export default semesterController;
