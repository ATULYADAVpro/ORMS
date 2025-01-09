// ============== Importing =============
import Joi from "joi";
import Student from "../../models/StudentModels.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Semester from "../../models/SemesterModel.js";
import Subject from "../../models/SubjectModels.js";

// ------------------ Logics --------------
const studentController = {
    // ------------ Add of Student Logic ------------
    async addStudent(req, res, next) {
        try {
            const studentSchema = Joi.object({
                firstName: Joi.string().required(),
                fatherName: Joi.string().required(),
                lastName: Joi.string().required(),
                motherName: Joi.string().required(),
                profileUrl: Joi.string().required(),
                dateYear: Joi.number().optional(),
                codeId: Joi.string().required(),
                admissionDate: Joi.string().required(),
                prn: Joi.number().optional(),
                mobileNo: Joi.number().required(),
                date_Of_year: Joi.string().required(),
                stream: Joi.string().required(),
                semester: Joi.optional()
            });
            const { error, value } = studentSchema.validate(req.body);
            if (error) { return next(error); }

            const studentExists = await Student.findOne({ mobileNo: value.mobileNo });
            if (studentExists) { return next(CustomErrorHandler.AlreadyExists("This Student Already Register.")); }

            const saveStudent = new Student(value);
            // console.log("Saving student data:", saveStudent);
            await saveStudent.save();

            res.status(200).json({ success: true, message: 'Added Successfully', saveStudent });

        } catch (error) {
            return next(error);
        }
    },

    // --------------- Add Student in Bulk inDB -----------------
    async addBulkStudents(req, res, next) {
        try {
            const studentSchema = Joi.object({
                firstName: Joi.string().required(),
                fatherName: Joi.string().required(),
                lastName: Joi.string().required(),
                motherName: Joi.string().required(),
                profileUrl: Joi.string().required(),
                dateYear: Joi.number().optional(),
                codeId: Joi.string().required(),
                prn: Joi.number().optional(),
                mobileNo: Joi.number().required(),
                date_Of_year: Joi.string().required(),
                stream: Joi.string().required(),
                semesters: Joi.optional()
            });

            const students = req.body.students; //  request body contains an array of students
            const validStudents = [];

            for (const student of students) {
                const { error, value } = studentSchema.validate(student);
                if (error) {
                    return next(error); // Return validation error for the specific student
                }

                const studentExists = await Student.findOne({ mobileNo: value.mobileNo });
                if (studentExists) {
                    return next(CustomErrorHandler.AlreadyExists("This Student Already Register."));
                }

                validStudents.push(value);
            }

            // Save all valid students in bulk
            const savedStudents = await Student.insertMany(validStudents);

            res.status(200).json({ success: true, message: 'Students Added Successfully', savedStudents });

        } catch (error) {
            return next(error);
        }
    },

    // --------------- Update Student Logic ----------
    async updateStudent(req, res, next) {
        try {
            const studentSchema = Joi.object({
                firstName: Joi.string().optional(),
                fatherName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                motherName: Joi.string().optional(),
                profileUrl: Joi.string().optional(),
                dateYear: Joi.number().optional(),
                codeId: Joi.string().optional(),
                prn: Joi.number().optional(),
                rollNo: Joi.string().optional(), // Added rollNo as an identifier
                mobileNo: Joi.number().optional(), // Kept mobileNo as an identifier
                date_Of_year: Joi.string().optional(),
                stream: Joi.string().optional(),
                semesters: Joi.optional()
            });

            const { error, value } = studentSchema.validate(req.body);
            if (error) { return next(error); }
            // console.log(value)
            // Use rollNo or mobileNo to find the student
            const student = await Student.findOneAndUpdate(
                {
                    $or: [
                        { rollNo: value.rollNo },
                        { mobileNo: value.mobileNo }
                    ]
                },
                value,
                { new: true, runValidators: true } // Returns the updated document
            );

            if (!student) {
                return next(CustomErrorHandler.notFound("Student not found."));
            }

            res.status(200).json({ success: true, message: 'Updated Successfully', student });

        } catch (error) {
            return next(error);
        }
    },

    // --------------- Delete Student Logic ----------
    async deleteStudent(req, res, next) {
        try {

            const { rollNo, mobileNo } = req.body;
            // console.log(req.body)
            // Ensure either rollNo or mobileNo is provided
            if (!rollNo && !mobileNo) {
                return next(CustomErrorHandler.notFound("Either rollNo or mobileNo must be provided."));
            }

            // Find the student
            const student = await Student.findOne({
                $or: [
                    { rollNo },
                    { mobileNo }
                ]
            });

            if (!student) {
                return next(CustomErrorHandler.notFound("Student not found."));
            }

            // Find and delete related semesters
            const semesters = await Semester.find({ student: student._id });
            for (const semester of semesters) {
                // Find and delete related subjects
                await Subject.deleteMany({ _id: { $in: semester.subjects } });

                // Delete the semester
                await Semester.deleteOne({ _id: semester._id });
            }

            // Delete the student
            await Student.deleteOne({ _id: student._id });

            res.status(200).json({ success: true, message: 'Deleted Successfully', student });

        } catch (error) {
            return next(error);
        }
    },

    // ------------ Get of Student Logic ------------
    async getStudent(req, res, next) {
        try {
            // Count the total number of students
            const totalStudents = await Student.countDocuments({});

            // Fetch the student data
            const getStudent = await Student.find({}).populate({
                path: 'stream'
            })
            if (!getStudent) {
                return next(CustomErrorHandler.notFound("Students not found!"));
            }

            // ---------- response for success -------
            res.status(200).json({ success: true, message: 'Students fetched successfully.', totalStudents, getStudent });

        } catch (error) {
            return next(error);
        }
    },



    // -------------- Get student for semester ---------
    async getStudentForSemester(req, res, next) {
        try {
            const { admissionDate, examType, stream, date_of_issue, sem } = req.body;

            const students = await Student.find({ admissionDate, stream });
            if (!students || students.length === 0) {
                return next(CustomErrorHandler.notFound("No Students Found"));
            }

            let studentsMatchingSemesters = [];

            for (const std of students) {
                const semesters = await Semester.find({
                    examType,
                    stream,
                    date_of_issue,
                    sem,
                    student: std._id
                });

                if (!semesters || semesters.length === 0) {
                    studentsMatchingSemesters.push(std);
                }
            }

            if (studentsMatchingSemesters.length === 0) {
                return next(CustomErrorHandler.notFound("All Students have done Semesters"));
            }

            return res.status(200).json(studentsMatchingSemesters);

        } catch (error) {
            return next(error);
        }
    },

    async getStudentHaveSemester(req, res, next) {
        try {
            const { admissionDate, examType, stream, date_of_issue, sem, subjectId } = req.body;

            // Validate input
            if (!admissionDate || !stream || !examType || !sem || !subjectId) {
                return next(CustomErrorHandler.RequireField("Missing required fields"));
            }

            // Fetch students and populate semesters with subjects
            const students = await Student.find({ admissionDate, stream })
                .populate({
                    path: "semesters",
                    match: { examType, stream, date_of_issue, sem }, // Match semesters
                    populate: {
                        path: "subjects",
                        select: "subjectId", // Only fetch subjectId for efficiency
                    },
                });

            if (!students || students.length === 0) {
                return next(CustomErrorHandler.notFound("No Students Found"));
            }

            // Filter students based on subjects
            const filteredStudents = students.filter((student) => {
                // Check if all semesters for the student are valid
                return student.semesters.every((semester) => {
                    if (!semester || !semester.subjects || semester.subjects.length === 0) {
                        // Semester is valid if subjects array is empty
                        return true;
                    }

                    // Check if none of the subjects match the given subjectId
                    return !semester.subjects.some((subject) => subject.subjectId.toString() === subjectId);
                });
            });

            return res.status(200).json(filteredStudents);
        } catch (error) {
            return next(error);
        }
    }











}

// ========== Exporting student Controller ====
export default studentController