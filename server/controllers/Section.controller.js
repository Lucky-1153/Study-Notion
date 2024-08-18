import {Course} from '../models/Course.model.js'
import {ApiError} from '../utils/ApiError.js'
import {Section} from '../models/Section.model.js'

const createSection = async(req, res) => {
    try{
        const { sectionName, courseId} = req.body

        //validation
        if(!sectionName || !courseId) 
            throw new ApiError(401, "enter the required field")

        //create entry in dbnxxx
        const newSection = await Section.create({ sectionName })

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            }
        )

        const updatedCourseDetails = await Course.findById(courseId).populate({
                                        path:'courseContent',
                                        // populate:{
                                        //     path: 'Section'
                                        // }
                                    })

        res.status(200).json({
            success: true,
            updatedCourseDetails,
            message: 'Section created successfully'
        })
    }
    catch (error) {
        throw new ApiError(389, "error while adding a new section",error)
    }
}

//===============update Section====================
const updateSection = async( req, res) => {
    try {
        const { sectionName, sectionId, courseId} = req.body
    
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
    
        //update Section  name in db
        await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName,
            },
            {
                new: true,
            }
        )
    
        const updatedCourseDetails = await Course.findById(courseId)
                                            .populate({
                                                path: 'courseContent',
                                                populate: {
                                                    path: 'subSection'
                                                }
                                            })
    
        res.status(200).json({
            success: true,
            data:updatedCourseDetails,
            message: 'Section updated successfully'
        });
    } catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }

}


//===========delete Section===================

const deleteSection = async(req, res) => {
    try {
        const {sectionId, courseId} = req.body
    
        await Section.findByIdAndDelete(sectionId)
    
        const updatedCourseDetails = await Course.findById(courseId)
                                            .populate({
                                                path:'courseContent',
                                                populate:{
                                                    path:'subSection'
                                                }
                                            })
    
        res.status(200).json({
            success: true,
            data: updatedCourseDetails,
            message: 'Section deleted successfully'
        })
    } catch (error) {
        console.log('Error while deleting section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting section'
        })
    }
}

export {
    createSection,
    updateSection,
    deleteSection,
}

