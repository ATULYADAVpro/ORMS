import Joi from "joi";
import CustomErrorHandler from '../../utils/services/CustomErrorHandler.js'
import User from "../../models/UserModels.js";
import JwtService from "../../utils/services/JwtService.js";
import { createTransport } from 'nodemailer'
import Otp from "../../models/OtpModel.js";

//Nodemailer Create
let transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})




const authController = {
    // -------- Register logic --------
    async register(req, res, next) {
        // --------- ValidateSchema ------
        const schema = Joi.object({
            firstName: Joi.string().required(),
            middleName: Joi.string().required(),
            lastName: Joi.string().required(),
            profile: Joi.string().required(),
            // password: Joi.string().required(),
            email: Joi.string().email().required(),
            role: Joi.string().required(),
            department: Joi.string().required(),
            userId: Joi.string(),
            codeId: Joi.string(),
        })

        const { error, value } = schema.validate(req.body)
        if (error) {
            return next(error)
        }

        //----- User exits or not ----
        try {
            const { email } = req.body;
            const UserExit = await User.exists({ email })
            if (UserExit) { return next(CustomErrorHandler.AlreadyExists('User Already Exists')) }
            const addUser = new User(value)
            await addUser.save();

            res.status(200).json({ success: true, message: 'Add Succussfully..', addUser })

        } catch (error) {
            return next(error)
        }
    },


    // -------- Login logic --------
    async login(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        const { error, value } = schema.validate(req.body)
        if (error) { return next(error) }

        try {
            const UserExist = await User.findOne({ email: value.email })
            if (!UserExist) { return next(CustomErrorHandler.RandomMsg("User is not Register")) }
            if (UserExist.password !== value.password) { return next(CustomErrorHandler.wrongCredential("Wrong Credential || Check your Email and password")) }
            // Generate Access Token
            const token = JwtService.sign({
                success: true,
                message: 'Logged In successfully',
                isAuthenticated: true,
                user: {
                    email: UserExist.email,
                    role: UserExist.role,
                    profile: UserExist.profile
                }
            })
            // Get Response
            const { password: pass, ...rest } = UserExist._doc;
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
        } catch (error) {
            return next(error)
        }


    },

    // -------- Sending otp logic --------
    async sendOtp(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) return next(error);

        try {
            const { email } = value;
            const UserExist = await User.findOne({ email });
            if (!UserExist) {
                return next(CustomErrorHandler.wrongCredential("are you not register user."))
            }

            const OTP = Math.floor(1000 + Math.random() * 9000);
            const expirationTime = new Date(Date.now() + 1 * 60 * 1000); // 1 minutes

            const existEmail = await Otp.findOne({ email });
            if (existEmail) {
                await Otp.findByIdAndUpdate(
                    { _id: existEmail._id },
                    { otp: OTP, expiresAt: expirationTime },
                    { new: true }
                );
            } else {
                const saveOtpData = new Otp({ email, otp: OTP, expiresAt: expirationTime });
                await saveOtpData.save();
            }

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Your OTP for Login",
                text: `Your OTP is ${OTP}. It is valid for 1 minutes.`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return res.status(500).json({ error: "Email not sent" });
                }
                res.status(200).json({ message: "OTP sent successfully" });
            });
        } catch (error) {
            return next(error);
        }
    },


    // -------- login_With_OTP logic --------
    async loginOtp(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) return next(error);

        const { email, otp } = value;

        try {
            const otpVerification = await Otp.findOne({ email });
            if (!otpVerification) {
                return next(CustomErrorHandler.Invailed("OTP not found. Please request a new one."));
            }

            // Check OTP expiration
            if (otpVerification.expiresAt < new Date()) {
                return next(CustomErrorHandler.Invailed("OTP has expired. Please request a new one."));
            }

            // Validate OTP
            if (otpVerification.otp !== otp) {
                return next(CustomErrorHandler.Invailed("Invalid OTP. Please try again."));
            }

            const UserExist = await User.findOne({ email });
            if (!UserExist) {
                return next(CustomErrorHandler.Invailed("User does not exist."));
            }

            // Generate Access Token
            const token = JwtService.sign({
                success: true,
                message: 'Logged In successfully',
                isAuthenticated: true,
                user: {
                    email: UserExist.email,
                    role: UserExist.role,
                    profile: UserExist.profile
                }
            })

            // Return User Data
            const { password: pass, ...rest } = UserExist._doc;
            res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
        } catch (error) {
            return next(error);
        }
    },


    // -------- Logout logic --------
    async logout(req, res) {
        res.clearCookie('access_token').json({
            success: true,
            message: 'Logged out successfull'
        })
    },


    // -------- Check user auth -------

    async checkUser(req, res) {
        const user = req.user;
        res.status(200).json({
            isAuthenticated: true,
            success: true,
            message: 'Authenticated user',
            user: user
        })
    },

}

export default authController