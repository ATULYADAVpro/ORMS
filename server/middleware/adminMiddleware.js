// // ======= Importing =======
// import Teachars from "../models/userModel.js";
// import CustomErrorHandler from "../utils/CustomErrorHandler.js";

// // ======= Logic ===========
// const admin = async (req, res, next) => {
//     try {
//         const user = await Teachars.findOne({ teachar_id: req.user.id });
//         if (user.role === 'admin') {
//             next(); // if next without parameter we can pass then meain there are next call middileware
//         } else {
//             return next(CustomErrorHandler.unAuthorized());
//         }
//     } catch (err) {
//         return next(err);
//     }
// }

// // ========== Exporting =========
// export default admin;