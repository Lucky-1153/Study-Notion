import { Router } from "express";
const router = Router()


//=====================Controllers=============================
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSection.controller.js";
import { createCourse, deleteCourse, editCourse, getCourseDetails, getFullCourseDetails, getInstuctorCourses, showAllCourses } from "../controllers/Course.controller.js";
import { categoryPageDetails, createCategory, getAllCategory } from "../controllers/Category.controller.js";
import { createRating, getAllRating, getAverageRating } from "../controllers/RatingAndReviews.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.controller.js";


//====================Middlewares==================================
import {auth, isAdmin, isInstructor, isStudent} from '../middlewares/auth.middleware.js'
import { updateCourseProgress } from "../controllers/CourseProgress.Controller.js";



//==================Course Routes=====================
//course can be created only by instructor


router.route('/createCourse').post( auth, isInstructor, createCourse)
router.route('/editCourse').post(auth, isInstructor, editCourse)

//add a section to a course
router.route('/addSection').post( auth, isInstructor, createSection)
//update a section to a course
router.route('/updateSection').post( auth, isInstructor, updateSection)
//delete a section
router.route('/deleteSection').post( auth, isInstructor, deleteSection)

//subSection
router.route('/addSubSection').post( auth, isInstructor, createSubSection)
router.route('/updateSubSection').post( auth, isInstructor, updateSubSection)
router.route('/deleteSubSection').post( auth, isInstructor, deleteSubSection)

router.route('/getFullCourseDetails').post(auth, getFullCourseDetails)

router.route("/getInstructorCourses").get( auth, isInstructor, getInstuctorCourses)
router.route('/deleteCourse').delete(deleteCourse)
router.route('/getCourseDetails').post( getCourseDetails)
router.route('/getAllCourses').get( auth, isInstructor, showAllCourses)
// router.route('/getFullCourseDetails').post( auth, isInstructor, getFullCourseDetails)
//get all courses under a specific instructor
// router.route('/getInstructorCourses').get( auth, isInstructor, getInstructorCourses)

// router.route('/editCourse').post( auth, isInstructor, editCourse)
// router.route('/deleteCourse').delete( auth, isInstructor, deleteCourse)
// router.route('/updateCourseProgress').post( auth, isInstructor, updateCourseProgress)

router.route('/updateCourseProgress').post(auth, isStudent, updateCourseProgress)


//=========================Category routes for admin===============
//category can only be created by admin

router.route('/createCategory').post( auth, isAdmin, createCategory)
// router.route('/deleteCategory').delete( auth, isAdmin, deleteCategory)
router.route('/showAllCategories').get( getAllCategory)
router.route('/getCategoryPageDetails').post(categoryPageDetails)


//============Rating and Review==================================
router.route('/createRating').post( auth, isStudent, createRating)
router.route('/getAverageRating').get(getAverageRating)
router.route('/getReviews').get(getAllRating)











export default router

