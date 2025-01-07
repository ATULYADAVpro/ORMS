import Joi from 'joi'
import Subject from '../../models/SubjectModels.js';
import CustomErrorHandler from '../../utils/services/CustomErrorHandler.js';
import Department from '../../models/Department.js';

const subjectController = {
    // ========== add subject ======
    async addSubject(req, res, next) {
        const subjectSchema = Joi.object({
            stream: Joi.string().required(),
            sem: Joi.string().required(),
            name: Joi.string().required(),
            code: Joi.string().required(),
            credit: Joi.string().required(),
            internalMax: Joi.string().required(),
            externalMax: Joi.string().required(),
            totalMax: Joi.string().required(),
            totalMin: Joi.string().required(),
            internalMin: Joi.string().required(),
            externalMin: Joi.string().required(),
            practicalName: Joi.string().optional(),
            practicalCode: Joi.string().optional(),
            practicalMax: Joi.string().optional(),
            practicalMin: Joi.string().optional(),
            practicalCredit: Joi.string().optional(),
        });

        const { error, value } = subjectSchema.validate(req.body);
        if (error) return next(error);

        try {
            const department = await Department.findById(value.stream);
            if (!department) {
                return next(CustomErrorHandler.NotFound('Department not found.'));
            }

            if (department.practical) {
                if (!value.practicalName || !value.practicalCode) {
                    return next(
                        CustomErrorHandler.ValidationError(
                            'Practical name and code are required for departments that require practicals.'
                        )
                    );
                }
            }

            const exists = await Subject.exists({ code: value.code });
            if (exists) {
                return next(CustomErrorHandler.AlreadyExists('Subject already exists.'));
            }

            const subject = new Subject(value);
            await subject.save();

            res.status(201).json({ success: true, message: 'Added successfully.', subject });
        } catch (err) {
            next(err);
        }
    },

    // ========== get subject =======
    async getSubject(req, res, next) {
        const { stream } = req.query;

        if (!stream) {
            return next(CustomErrorHandler.RequireField("Stream and sem are required."))
        }

        try {
            const result = await Subject.find({ stream });
            if (!result) {
                return next(CustomErrorHandler.notFound('Not Found'))
            }

            if (result.length > 0) {

                const sem1 = result.filter(sem => sem.sem === "1")
                const sem2 = result.filter(sem => sem.sem === "2")
                const sem3 = result.filter(sem => sem.sem === "3")
                const sem4 = result.filter(sem => sem.sem === "4")


                res.status(201).json({ success: true, sem1, sem2, sem3, sem4 });
                return
            }
            res.status(201).json({ success: false });

        } catch (err) {
            return next(err)
        }
    },
    // ========== get All subject =======
    async getAllSubject(req, res, next) {
        try {
            const result = await Subject.find({}).populate({
                path: 'stream'
            })
            if (!result) { return next(CustomErrorHandler.notFound("Subject is not available")) }

            res.status(201).json({ success: true, result });

        } catch (error) {
            return next(error)
        }
    },
    // ========== update subject =======
    async subjectUpdate(req, res, next) {
        try {
            const { _id, ...rest } = req.body;
            const subjectExists = await Subject.findOne({ _id })
            // Check if the subject exists
            if (!subjectExists) {
                return next(CustomErrorHandler.notFound('Subject does not exist'));
            }

            // Update the subject
            const updatedSubject = await Subject.findOneAndUpdate(
                { _id },
                { $set: rest },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                success: true,
                message: 'Subjects updated successfully.',
                user: updatedSubject,
            });


        } catch (error) {
            return next(error)
        }
    },
    // ====== Delete Subject ===
    async deleteSubject(req, res, next) {
        try {
            const { _id } = req.params; // Assuming email is passed as a URL parameter
            // console.log(_id)
            // Check if the user exists
            const subjectExists = await Subject.findOne({ _id });
            if (!subjectExists) {
                return next(CustomErrorHandler.notFound('Subject not found.'));
            }

            // Delete the user from the database
            await Subject.findOneAndDelete({ _id });

            res.status(200).json({
                success: true,
                message: 'Subjects deleted successfully.',
            });
        } catch (error) {
            return next(error);
        }
    },
};

export default subjectController;
