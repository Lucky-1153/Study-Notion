import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
const router = Router()

//========================import controllers=====================




//======================import middlewares======================
import { auth, isInstructor} from '../middlewares/auth.middleware.js'
import { deleteAccount, getAllUserDetails, getEnrolledCourses, updateProfile, updateUserProfileImage, instructorDashboard } from "../controllers/Profile.controller.js";




//==========================routes===============================

router.route('/updateUserProfileImage').put( 
    // upload.fields(
    //     {
    //         name: 'thumbnail',
    //         maxCount: 1
    //     }
    // ),
    auth, updateUserProfileImage)
router.route('/deleteProfile').delete( auth, deleteAccount)
router.route('/updateProfile').put( auth, updateProfile)
router.route('/getUserDetails').get( auth, getAllUserDetails)


router.route('/getEnrolledCourses').get( auth, getEnrolledCourses)
// router.route('/updateUserProfileImage').put( auth, updateUserImage)
router.route('/instructorDashboard').get( auth, isInstructor, instructorDashboard)



export default router