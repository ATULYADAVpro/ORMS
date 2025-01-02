// ============== Importing =============
import Joi from "joi";
import Student from "../../models/StudentModels.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";

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
                prn: Joi.number().optional(),
                mobileNo: Joi.number().required(),
                date_Of_year: Joi.string().required(),
                stream: Joi.string().required(),
                semisters: Joi.optional()
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
                semisters: Joi.optional()
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
                rollNo: Joi.number().optional(), // Added rollNo as an identifier
                mobileNo: Joi.number().optional(), // Kept mobileNo as an identifier
                date_Of_year: Joi.string().optional(),
                stream: Joi.string().optional(),
                semisters: Joi.optional()
            });

            const { error, value } = studentSchema.validate(req.body);
            if (error) { return next(error); }

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
                return next(CustomErrorHandler.NotFound("Student not found."));
            }

            res.status(200).json({ success: true, message: 'Updated Successfully', student });

        } catch (error) {
            return next(error);
        }
    },
    
    // --------------- Delete Student Logic ----------
    async deleteStudent(req, res, next) {
        try {
            const studentSchema = Joi.object({
                rollNo: Joi.number().optional(),
                mobileNo: Joi.number().optional()
            });

            const { error, value } = studentSchema.validate(req.body);
            if (error) { return next(error); }

            // Ensure either rollNo or mobileNo is provided
            if (!value.rollNo && !value.mobileNo) {
                return next(CustomErrorHandler.notFound("Either rollNo or mobileNo must be provided."));
            }

            // Use rollNo or mobileNo to find and delete the student
            const student = await Student.findOneAndDelete({
                $or: [
                    { rollNo: value.rollNo },
                    { mobileNo: value.mobileNo }
                ]
            });

            if (!student) {
                return next(CustomErrorHandler.NotFound("Student not found."));
            }

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
            const getStudent = await Student.find({});
            if (!getStudent) {
                return next(CustomErrorHandler.notFound("Students not found!"));
            }

            // ---------- response for success -------
            res.status(200).json({ success: true, message: 'Students fetched successfully.', totalStudents, getStudent });

        } catch (error) {
            return next(error);
        }
    }


}

// ========== Exporting student Controller ====
export default studentController