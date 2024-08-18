import {Section} from '../models/Section.model.js'
import { ApiError } from '../utils/ApiError.js';
import {SubSection} from '../models/SubSection.model.js'
import {uploadOnCloudinary} from '../utils/uploadOnCloudinary.js'

const createSubSection = async(req, res) => {
    try {
        //fetch the data
        const {sectionId, title, timeDuration, description} = req.body;
    
        //fetch the video 
        const video = req.files?.video
       
    
        //validation
        if( [sectionId, title, timeDuration, description].some((field) => field === ""))
            throw new ApiError(401, 'all fields are required')
    
        //upload on cloudinary
        const uploadVideo = await uploadOnCloudinary(video, process.env.FOLDER_NAME)

        //create subsection
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadVideo.url
        })
 
        //update subSection id in section
        const  updatedSection = await Section.findByIdAndUpdate(
            {_id : sectionId},
            {
                $push:{
                    subSection: subSectionDetails._id,
                }
                
            },
            {
                new: true,
                populate: 'subSection'
            }
        )
        //return opulate({path: "subSection"})res
    
        return res
        .status(200)
        .json(
            {
                success: true,
                message: "subSection craeted Successfuly" ,
                data: updatedSection
            }
        )
    } catch (error) {
        throw new ApiError(500, "unable to create subSection",error)
    }
}



//=============update Section======================
const updateSubSection = async( req, res) => {
   try {
     //fetcht the data
     const{ sectionId, subSectionId, title, descripition} = req.body;
 
     //validation
     if(!subSectionId)
         throw new ApiError(401, "subSection Id is requried to update")
 
     const subSection = await SubSection.findById(subSectionId)
 
     if(!subSection)
         throw new ApiError(402, "subSection not found")
 
     //add data
     if(title)
         subSection.title = title
 
     if(descripition)
         subSection.descripition = descripition
 
     if(req.files && req.files.videoFile !== undefined){
         const video = req.files.videoFile;
         const uploadVideoDetails = await uploadOnCloudinary(video, process.env.FOLDER_NAME)
         subSection.videoUrl = uploadVideoDetails.secore_url;
         subSection.timeDuration = uploadVideoDetails.duration;
     }
     
     //save data to db
     await subSection.save()
 
     const updatedSection = await Section.findById(sectionId).populate("subSection")
 
     return res.json({
         success: true,
         data: updatedSection,
         message: "Section updated Successfully"
     })
   } catch (error) {
        throw new ApiError(500, "Error while updating subSection")
   }
}


const deleteSubSection = async(req, res) => {
    try {
        const {subSectionId, sectionId} = req.body
        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})
    
        if(!subSection)
            throw new ApiError(400, "subSection not found")
    
        const updatedSection = await Section.findById(sectionId).populate("subSection")
    
        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        throw new ApiError(500, "Error while deleting SubSection")
    }
}


export{
    createSubSection,
    updateSubSection,
    deleteSubSection
}
