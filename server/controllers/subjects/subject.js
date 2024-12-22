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
            practicalName: Joi.string().optional(),
            practicalCode: Joi.string().optional(),
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
        const { stream, sem} = req.query;

        if (!stream || !sem) {
            return next(CustomErrorHandler.RequireField("Stream and sem are required."))
        }

        try {
            const result = await Subject.find({ stream, sem });
            if (!result) {
                return next(CustomErrorHandler.notFound('Not Found'))
            } 

            res.status(201).json({ success: true, result });

        } catch (err) {
            return next(err)
        }
    }
};

export default subjectController;
