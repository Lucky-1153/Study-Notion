import mongoose from 'mongoose';
import {RatingAndReview} from '../models/RatingAndReview.model.js'
import {Course} from '../models/Course.model.js'
import { ApiError } from '../utils/ApiError.js';

//================Create Rating========================

const createRating = async (req, res) => {
    try {
        //get rating, userId, courseId
        const userId = req.user._id;
        const {rating, review, courseId} = req.body
        
        if (!rating || !review || !courseId) {
            return res.status(401).json({
                success: false,
                message: "All fileds are required"
            });
        }

        
        //chekc user if enrolled
        const courseDetails = await Course.findOne(
            {_id: courseId,
                studentsEnrolled: {$elemMatch: {$eq: userId}}
            }
        )
        console.log("once again")
    
        if(!courseDetails)
            throw new ApiError(400, "student is not enrolled in the course")
        //check if user already rated or not
    
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
    
        if(alreadyReviewed)
            throw new ApiError(401, "Course is already reviewed by student")
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        })
        //update course with rating/review
    
        await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new: true}
        )
        //return response
        return res
        .status(200)
        .json({
            success: true,
            message:"Rating and Reviews created"
        })
    } catch (error) {
        throw new ApiError(500, "error is ",error)
    }
}

 
//================getAverage Rating====================
const getAverageRating = async (req, res) => {
    try{
        //get course id
        const courseId = req.body.courseId;

        //calc average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: { $avg: "$rating"}
                }
            }
        ])

        //return raitng
        if(result.length > 0){
            return res
            .status(200)
            .josn({
                success: true,
                message: "average rating calculated successfuly",
                averageRating: result[0].averageRating
            })
        }

        else {
            throw new ApiError(402, "could not calculate average rating")
        }
    
    }
    catch(error){
        throw new ApiError(402, "could not calculate average rating",error)
    }
}

//================getAll Rating=======================

const getAllRating = async( req, res) =>{
    try {
        const allReviews = await RatingAndReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path: "user",
                                    select: "firstName lastName email image",
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName",
                                })
                                .exec();
    
        return res
        .status(200)
        .json({
            success: true,
            message: "all reviews fetched successfully",
            data: allReviews,
        })
    } catch (error) {
        throw new ApiError(500, error)
    }

}



export{
    getAllRating,
    createRating,
    getAverageRating,
}