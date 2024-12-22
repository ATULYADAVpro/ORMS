import Joi from "joi";
import Department from "../../models/Department.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";

const department = {
    // ============= Add Department =======
    async addDepartment(req, res, next) {
        const departmentSchema = Joi.object({
            stream: Joi.string().required(),
            code: Joi.number().required(),
            practical: Joi.boolean().required()
        })

        const { error, value } = departmentSchema.validate(req.body);
        if (error) {
            return next(error)
        }
        try {
            const existDepartment = await Department.exists({ code: value.code, stream: value.stream })
            if (existDepartment) { return next(CustomErrorHandler.AlreadyExists('Already Added Department...')) }

            const addDepart = new Department(value)
            await addDepart.save();
            res.status(200).json({ success: true, message: 'Add Succussfully..', addDepart })
        } catch (error) {
            return next(error)
        }
    },

    // ============== get department ============

    async getDepartment(req, res, next) {
        const department = await Department.find({});
        if (!department) {
            return next(CustomErrorHandler.RequireField("Do not have any department.."))
        }
        res.status(200).json({ success: true, department })
    }
}

export default department;