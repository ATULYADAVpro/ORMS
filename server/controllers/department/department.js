import Joi from "joi";
import Department from "../../models/Department.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";

const department = {
    // ============= Add Department =======
    async addDepartment(req, res, next) {
        const departmentSchema = Joi.object({
            stream: Joi.string().required(),
            code: Joi.number().required(),
            practical: Joi.boolean().required(),
            addmissionYearsCode: Joi.required()
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
    async getDepartmentById(req, res, next) {
        const { _id } = req.params;
        const department = await Department.findById(_id);
        if (!department) {
            return next(CustomErrorHandler.RequireField("Do not have any department.."))
        }
        res.status(200).json({ success: true, department })
    },
    // ============== get department ============
    async getDepartment(req, res, next) {
        const department = await Department.find({});
        if (!department) {
            return next(CustomErrorHandler.RequireField("Do not have any department.."))
        }
        res.status(200).json({ success: true, department })
    },

    // ============== Update department ============
    async updateDepartment(req, res, next) {
        try {
            const { _id, ...rest } = req.body;
            const departmentUpdated = await Department.findByIdAndUpdate(
                { _id },
                { $set: rest },
                { new: true } // Return the updated document
            )
            if (!departmentUpdated) { return next(CustomErrorHandler.notFound("Department is Not found! ")) }

            res.status(200).json({
                success: true,
                message: 'Department updated successfully.',
                departmentUpdated,
            });

        } catch (error) {
            return next(error)
        }
    },

    // ============== Delete department ============
    async deleteDepartment(req, res, next) {
        try {
            const { _id } = req.params;
            const subjectExists = await Department.findOne({ _id });
            if (!subjectExists) {
                return next(CustomErrorHandler.notFound('Department not found.'));
            }

            // Delete the Deoartment from the database
            await Department.findOneAndDelete({ _id });

            res.status(200).json({
                success: true,
                message: 'Department deleted successfully.',
            });

        } catch (error) {
            return next(error)
        }
    }
}

export default department;