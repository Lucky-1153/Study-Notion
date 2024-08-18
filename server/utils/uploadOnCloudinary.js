import { v2 as cloudinary } from 'cloudinary'
import {ApiError} from './ApiError.js'
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
}); 

const uploadOnCloudinary = async(file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        // options.resourse_type = 'auto';
        options.resource_type = 'auto';
        console.log("hloooo")
        return await cloudinary.uploader.upload(file?.tempFilePath, options);
    } catch (error) {
        throw new ApiError(400, "error while uploading on cloudingary",error)
    } 
}


//to delete a resource by public ID
const deleteResourceFromCloudinary = async(url) => {
    if(!url) 
        return
    try{
        const result = await cloudinary.uploader.destroy(url)
        console.log(`Deleted resource with public Id: ${url}`)
        console.log('Deleted Resource result = ', result)
        return result
    }
    catch(error){
        throw new ApiError(500, `Error while deleting resoutce with public ID ${url}:`, error)
    }
}

export {
    uploadOnCloudinary,
    deleteResourceFromCloudinary
}

