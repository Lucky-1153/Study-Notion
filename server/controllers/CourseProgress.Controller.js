import mongoose from 'mongoose'

import {SubSection} from '../models/SubSection.model.js'
import {CourseProgress} from '../models/CourseProgress.model.js'

const updateCourseProgress = async(req, res) => {
    const { courseId, subSectionId} = req.body
    const  userId  = req.user._id
    
    try{
        const subSection = await SubSection.findById(subSectionId)
        if(!subSection)
            throw new Error( "INvalid subSection")
        console.log('userrid'.userId)
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        })

        if(!courseProgress)
            throw new Error("Course progress does not exist")
        else {
            if(courseProgress.completedVideos.includes(subSectionId)){
                throw new Error("SubSection already completed")
            }

            courseProgress.completedVideos.push(subSectionId)
        }

        await courseProgress.save()

        return res
        .status(200).json({message: "course progress updated"})
    } catch(error){
        console.log("error is ",error)
        throw new Error(300,"Internal server error in courseprogress controlled",)
        
    }

}

export {
    updateCourseProgress
}