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
    }
};

export default subjectController;
