import {Course} from '../models/Course.model.js'
import {User} from '../models/User.model.js'
import {ApiError} from '../utils/ApiError.js';
import {Category} from '../models/Category.model.js'
import {Section} from '../models/Section.model.js'
import {SubSection} from '../models/SubSection.model.js'
import {CourseProgress} from '../models/CourseProgress.model.js'
import { convertSecondsToDuration } from '../utils/SecToDuration.js';
import {uploadOnCloudinary, deleteResourceFromCloudinary} from '../utils/uploadOnCloudinary.js'


//===============Create new Course==================
const createCourse = async (req, res) => {



    try {
        //extract the data
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            category,
            status, 
            instructions, 
            tag
        } = req.body

        const courseAlreadyPresent = await Course.findOne({courseName})

        if(courseAlreadyPresent)
            throw new ApiError(389, "course already present with same name")

        // Convert the tag and instructions from stringified Array to Array
        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)


        //get thumbnail
        const thumbnail = req.files?.thumbnail;
        
        if(!thumbnail)
            throw new ApiError(333, "can't take file as input")
        
    
        //validation
        if( [courseName, courseDescription, whatYouWillLearn, price, category, tag, instructions].some( (field) => field === ""))
            throw new ApiError(401, "All fields are required")

        // if (!status || status === undefined) {
        //     status = "Draft";
        // }
    
        //check for instructor
        const instructorId = req.user._id

        
        if(!instructorId)
            throw new ApiError(402, "Instructor details not found")

        console.log("category is ",category)

        //validation for category
        const categoryDetails = await Category.findOne({name : category})
        if(!categoryDetails)
            throw new ApiError(402, "Category details not found")
        
    
        //upload image on cloudinary
        const thumbnailImage = await uploadOnCloudinary(thumbnail , process.env.FOLDER_NAME)
            
        //create an entry for new Course
        const newCourse = await Course.create(
            {
                courseName,
                courseDescription,
                instructor: instructorId,
                whatYouWillLearn,
                price,
                category: categoryDetails._id,
                tag,
                instructions,
                thumbnail: thumbnailImage.secure_url
            }
        )

        console.log("new course is ",newCourse)
        
    
        const instruct = await User.findByIdAndUpdate(
            {_id: instructorId},
            {
                $push:{
                    courses: newCourse._id,
                }
            }
        )
        .populate(
            {
                path: "courses"
            }
        )
        console.log(newCourse._id)

        const categoryDetails2 = await Category.findOneAndUpdate(
            { name : category },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          )

          
    
        return res
        .status(200)
        .json(
            {  
                success: true,
                message: "Course created successfully",
                data: newCourse
            }
        )
    } catch (error) {
        throw new ApiError(501, "Course creation failed",error)
    }


}


//==============Edit Course==================
const editCourse = async(req, res) => {
    try{
        const {courseId} = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if(!course)
            throw new ApiError(501, "Course not found")

        if(req.files){
            console.log("thumbnail update")
            const thumbnail = req.files.thumbnail
            const thumbnailImage = await uploadOnCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        //update ony the fieds that are present in request body
        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                course[key] = updates[key]
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id : courseId,
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        })
        .exec()

        res.json({
            sucess: true,
            message: "Course updated Successfully",
            data: updatedCourse,
        })
    } catch(error){
        throw new ApiError(504, "not able to edit course backend")
    }
}


//================Get all courses===========
const showAllCourses = async (req, res) => {
   try {
     const allCourses = await Course.find({}, {
         courseName: true,
         price: true,
         thumbnail: true,
         instructor: true,
         ratingAndReviews: true,
         studenEnrolled: true,
     })
     .populate({
        path: 'instructor',
        select: 'firstname lastName email image'
     })
 
     return res
     .status(200)
     .json({
         success: true,
         message: "all courses returned successfully",
         data: allCourses
     })
   } catch (error) {
        throw new ApiError(501, "unable to return courses")
   }
}


//=================get Course details==================
const getCourseDetails = async (req, res) => {

    try {
      
        const {courseId} = req.body
         
        const courseDetails = await Course.findOne(
            {_id : courseId})
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails"
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection"
                }
            })
    
            //validationos
        if(!courseDetails)
            throw new ApiError(400, `could not find the course with ${courseId}`)

        console.log("here is coursedetails in controller : ", courseDetails)
    
        return res
        .status(200)
        .json({
            success: true,
            message:  "course details fetched successfully",
            data : courseDetails,
        })
    } catch (error) {
        throw new ApiError(500,error)
    }
    
}

const deleteCourse = async(req, res) => {
    try{
        const {courseId} = req.body
        const course = await Course.findById(courseId)
        if(!course)
            throw new ApiError(401, "course not found")

        const studentsEnrolled = course.studentsEnrolled
        for( const studentId of studentsEnrolled){
            await User.fintByIdAndUpdate(studentId, {
                $pull: {courses: courseId}
            })
        }

        const courseSections = course.courseContent
        for( const courseSectionId of courseSections) {
            const section = await Section.findById(courseSectionId)
            if(section) {
                const subSections = section.subSection
                for( const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }
            await Section.findByIdAndDelete(courseSectionId)
        }

        await Course.findByIdAndDelete(courseId)

        return res
        .status(200)
        .json({
            success: true,
            message: "course deleted successfully"
        })

    } catch(error){
        console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
    }
}

const getInstuctorCourses = async( req, res) => {
    try {
        const instructorId = req.user._id
    
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({createdAt: -1})
    
        return res
        .status(200)
        .json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
    })
    }
}

const getFullCourseDetails = async(req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user?._id
        console.log("useriiiiid",userId)
        const courseDetails = await Course.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()

          console.log("courseId",courseId)
          console.log("userID",userId.toString())
    
        let courseProgressCount = await CourseProgress.findOne({
          courseId: courseId,
          userId: userId.toString(),
        })
    
        console.log("courseProgressCount : ", courseProgressCount)
    
        if (!courseDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
          })
        }
    
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            if (!isNaN(timeDurationInSeconds)) {
                totalDurationInSeconds += timeDurationInSeconds;
              }
            // totalDurationInSeconds += timeDurationInSeconds
          })
        })
        
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        console.log("totalduration:",totalDurationInSeconds)
        console.log("completed video",courseProgressCount?.completedVideos)
        return res.status(200).json({
          success: true,
          data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
              ? courseProgressCount?.completedVideos
              : [],
          },
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}

export {
    getCourseDetails,
    createCourse,
    editCourse,
    showAllCourses,
    deleteCourse,
    getInstuctorCourses,
    getFullCourseDetails
}