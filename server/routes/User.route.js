import { Router } from "express";
const router = Router()

//====================Import Controllers===========================
import { changePassword, logIn, sendOTP, signUp } from "../controllers/Auth.controller.js";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword.controller.js";



//=====================Import Middlewares===============================
import { auth, isAdmin} from '../middlewares/auth.middleware.js'



//========================Create rotues for controllers==============


//send otp
router.route('/send-otp').post(sendOTP)
//Authentication Routes
router.route('/signup').post(signUp)
router.route('/login').post(logIn)
router.route('/sendOTP').post(sendOTP)
router.route('/changePassword').post( auth, changePassword)

//Reset password
router.route('/reset-password-token').post(resetPasswordToken)
router.route('/reset-password').post(resetPassword)

//************************Only for Admin******************************/
// router.route('/all-students').post( auth, isAdmin, getAllStduends)
// router.route('/all-instructors').post( auth, isAdmin, getAllInstructors)




export default router