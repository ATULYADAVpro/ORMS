import Marks from "../../models/MarkModel.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";

const markController = {
    async updateMark(req, res, next) {
        const { _id, ...data } = req.body;
        console.log(data);  // Log to see the data you're trying to update

        try {
            // Find and update the document by ID
            const marks = await Marks.findByIdAndUpdate(_id, data, { new: true })

            if (!marks) {
                return next(CustomErrorHandler.notFound("Marks not found"));
            }
            // console.log(marks)

            // Return a success response with the updated marks document
            res.json({ message: "Update successful!", marks });
        } catch (error) {
            return next(error);  // Pass the error to the error handling middleware
        }
    }
};

export default markController;
