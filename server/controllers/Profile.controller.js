import { populate } from 'dotenv';
import {Profile} from '../models/Profile.model.js'
import {User} from '../models/User.model.js'
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';
import {CourseProgress} from '../models/CourseProgress.model.js'
import {convertSecondsToDuration} from '../utils/SecToDuration.js'
import {Course} from '../models/Course.model.js'

//==============update Profile================
const updateProfile = async(req, res) => {
    try {
        //get data
        const {dateOfBirth="", about="", contactNumber="", gender = "", firstName="", lastName=""} = req.body;
    
        //get userId
        const userId = req.user._id;
    
        //find Profile
        const userDetails = await User.findById(userId)
        const profileId =  userDetails.additionalDetails
        const proflieDetails = await Profile.findById(profileId)
    
        //update Proffile
        userDetails.firstName = firstName
        userDetails.lastName = lastName

        await userDetails.save()

        proflieDetails.dateOfBirth = dateOfBirth
        proflieDetails.about = about
        proflieDetails.gender = gender
        proflieDetails.contactNumber = contactNumber

        await proflieDetails.save()

        const updateUserDetails = await User.findById(userId)
                                            .populate("additionalDetails")
                                            .exec()
    
        return res
        .status(200)
        .json({
            success: true,
            message: "Proflie Updated Succesfuly",
            updateUserDetails
        })
    } catch (error) {
        throw new ApiError(500, "Error while updating Proflie",error)
    }
}


//===========delete Account======================
const deleteAccount = async(req, res) => {
    try {
        const id = req.user.id;
    
        const userDetails = await User.findById(id)
        if(!userDetails)
            throw new ApiError(401, "user not found")
    
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
    
        await User.findByIdAndDelete({_id: id})
    
        return res
        .status(200)
        .json({
            success: true,
            message: "account deleteed successful"
        })
    } catch (error) {
        throw new ApiError(500, "Failed during account deleting")
    }
}


//======================get all user Details============

const getAllUserDetails = async(req, res) => {
    try {
        const id = req.user._id;
    
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
    
        return res
        .status(200)
        .json({
            success:true,
            message: "user created successfully",
            userDetails
        })
    } catch (error) {
        throw new ApiError(500, "failed during geting user details",error)
    }

}

const updateUserProfileImage = async(req, res) =>{
    try{
        const profileImage =  req.files.profileImage
        const userId = req.user?._id
        console.log(req.files)
        if(!userId)
            throw new ApiError(295,"no userId found")

        if(!profileImage)
        {   console.error()
            throw new ApiError(300, "no profile image found")
        }

        console.log("profile Image : ",profileImage)

        const image = await uploadOnCloudinary(profileImage, process.env.FOLDER_NAME, 1000,1000)
        
        if( !image)
            throw new ApiError(312, "no image found")

        const updatedUserDetails = await User.findOneAndUpdate(userId,
            {
                image: image.secure_url,
            },
            {
                new: true,
            }
        )
        .populate({
            path: "additionalDetails"
        })

        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedUserDetails,
        })
    }
    catch (error) {
        throw new ApiError(449, "fail to update image of user",error)
    }
}

const getEnrolledCourses = async(req, res) => {
    try {
        const userId = req.user._id
        console.log("hhhhhhhh")
        let userDetails = await User.findOne({
          _id: userId,
        })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec()
          console.log("prinitng userDetails:")
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            ) 
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          } 
          let courseProgressCount = await CourseProgress.findOne({
            courseId: userDetails.courses[i]._id,
            userId: userId,
          }) 
          
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
           
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier

              
          }
        }

        
    
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        console.log("error is ",error)
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}

const instructorDashboard = async(req, res) => {
  try{

    let userId = req.user._id
    userId = userId.toString()
    console.log("userid is", userId)
    const courseDetails = await Course.find({ instructor: userId})

    const courseData = courseDetails.map( (course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated  = totalStudentsEnrolled * course.price

      const courseDataWithStats = {
        _id : course._id,
        couseName: course.courseName,
        couseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    return res
    .status(200)
    .json({
      courses: courseData
    })
  } catch(error){
    console.log("error is ", error)
    throw new ApiError(500, "Server error")
  }
}

export {
    getAllUserDetails,
    updateProfile,
    deleteAccount,
    updateUserProfileImage,
    getEnrolledCourses,
    instructorDashboard
}