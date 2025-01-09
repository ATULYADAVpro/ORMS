import Subject from "../../models/SubjectModels.js";
import User from "../../models/UserModels.js";
import CustomErrorHandler from "../../utils/services/CustomErrorHandler.js";
import Joi from "joi";
const userController = {

    // ========= Get all User =======

    async getUser(req, res, next) {
        try {
            // Extract page and limit from query parameters with default values
            // const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            // const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 users per page

            // console.log(page)
            // Calculate the skip value
            // const skip = (page - 1) * limit;

            // Fetch the paginated users
            const users = await User.find({})
                .populate({
                    path: "department", // Field to populate
                    // select: "name", // Fields to include from Department
                })
            // .skip(skip)
            // .limit(limit);

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
                    // totalPages: Math.ceil(totalUsers / limit),
                    // currentPage: page,
                    // limit,
                },
            });
        } catch (error) {
            return next(error);
        }
    },

    // ======== Get User getUserQueryBase ========
    async getUserQueryBase(req, res, next) {
        try {
            const { department } = req.query;

            const user = await User.find({ department })
            if (!user) { return next(CustomErrorHandler.notFound("User are not found")) }

            res.status(200).json({ success: true, message: "successfuly fatching user", user })
        } catch (error) {
            return next(error)
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

    async getUserById(req, res, next) {
        try {
            const { _id } = req.params;
            const user = await User.findById(_id);
            if (!user) {
                return next(CustomErrorHandler.notFound("User not found || are you unauthorzied person"));
            }
            const { sem1, sem2, sem3, sem4 } = user.subjects;
            let semester1Array = [];
            let semester2Array = [];
            let semester3Array = [];
            let semester4Array = [];

            // Fetch details for sem1
            if (sem1 && sem1.length > 0) {
                for (const sem of sem1) {
                    const subjectDetails = await Subject.findById(sem);
                    if (!subjectDetails) {
                        return next(CustomErrorHandler.notFound(`Subject with ID ${sem} not found`));
                    }
                    semester1Array.push(subjectDetails); // Push details to array
                }
            }

            // Fetch details for sem2
            if (sem2 && sem2.length > 0) {
                for (const sem of sem2) {
                    const subjectDetails = await Subject.findById(sem);
                    if (!subjectDetails) {
                        return next(CustomErrorHandler.notFound(`Subject with ID ${sem} not found`));
                    }
                    semester2Array.push(subjectDetails); // Push details to array
                }
            }

            // Fetch details for sem3
            if (sem3 && sem3.length > 0) {
                for (const sem of sem3) {
                    const subjectDetails = await Subject.findById(sem);
                    if (!subjectDetails) {
                        return next(CustomErrorHandler.notFound(`Subject with ID ${sem} not found`));
                    }
                    semester3Array.push(subjectDetails); // Push details to array
                }
            }

            // Fetch details for sem4
            if (sem4 && sem4.length > 0) {
                for (const sem of sem4) {
                    const subjectDetails = await Subject.findById(sem);
                    if (!subjectDetails) {
                        return next(CustomErrorHandler.notFound(`Subject with ID ${sem} not found`));
                    }
                    semester4Array.push(subjectDetails); // Push details to array
                }
            }

            res.json({
                semester1Array,
                semester2Array,
                semester3Array,
                semester4Array
            });

        } catch (error) {
            return next(error);
        }
    }


};

export default userController;
