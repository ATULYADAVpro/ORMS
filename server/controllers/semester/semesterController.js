import Joi from "joi";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Student from "../../models/StudentModels.js";
import Semester from "../../models/SemesterModel.js";
import moment from "moment"; // Import moment for date handling

const semesterController = {
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
    }
};

export default semesterController;
