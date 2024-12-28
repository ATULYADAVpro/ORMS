import User from "../../models/UserModels.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Joi from "joi";
const userController = {
    async demo(req, res) {
        res.send(`it's working!`);
    },

    async getUser(req, res, next) {
        try {
            // Extract page and limit from query parameters with default values
            const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 users per page

            // console.log(page)
            // Calculate the skip value
            const skip = (page - 1) * limit;

            // Fetch the paginated users
            const users = await User.find({})
                .populate({
                    path: "department", // Field to populate
                    // select: "name", // Fields to include from Department
                })
                .skip(skip)
                .limit(limit);

            // Count the total number of users for metadata
            const totalUsers = await User.countDocuments();

            if (!users.length) {
                return next(CustomErrorHandler.notFound("No users found!"));
            }

            // Response with pagination metadata
            res.status(200).json({
                success: true,
                message: "Users fetched successfully.",
                users,
                meta: {
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: page,
                    limit,
                },
            });
        } catch (error) {
            return next(error);
        }
    },

    // ====== Update USer ===
    async updateUser(req, res, next) {
        try {
            const { email, ...updateFields } = req.body;

            // Check if the user exists
            const userExists = await User.findOne({ email });
            if (!userExists) {
                return next(CustomErrorHandler.notFound('User does not exist'));
            }

            // Update the user
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { $set: updateFields },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                success: true,
                message: 'User updated successfully.',
                user: updatedUser,
            });
        } catch (error) {
            return next(error);
        }
    },
    // ====== Delete USer ===
    // ====== Delete User ===
    async deleteUser(req, res, next) {
        try {
            const { email } = req.params; // Assuming email is passed as a URL parameter

            // Check if the user exists
            const userExists = await User.findOne({ email });
            if (!userExists) {
                return next(CustomErrorHandler.notFound('User not found.'));
            }

            // Delete the user from the database
            await User.findOneAndDelete({ email });

            res.status(200).json({
                success: true,
                message: 'User deleted successfully.',
            });
        } catch (error) {
            return next(error);
        }
    },

};

export default userController;
