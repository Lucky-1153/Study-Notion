import {Category} from '../models/Category.model.js'
import {ApiError} from '../utils/ApiError.js'

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

const createCategory = async (req, res) => {
    try {
        const { name, description} = req.body
        
        //validation
        if([name, description].some( (field) => field.trim() === ""))
            throw new ApiError(401, "enter the details")

        //create new entry in database
        await Category.create(
            {
                name,
                description
            }
        )

        return res
        .status(201)
        .json(
            {
                success: true,
                message: "Category created successfuly"
            }
        )
    } catch (error) {
        throw new ApiError(501, "unable to create the Category", error)
    }
}

const getAllCategory = async(req, res) => {
   try {
     const getAllCategory = await Category.find({}, { name: true, description: true})
     return res
     .status(201)
     .json(
         {
             successs: true,
             message: "all tag returned successfuly",
             getAllCategory,
         }
     )
   } catch (error) {
        throw new ApiError(501, error)
   }
}

// const categoryPageDetails = async(req, res) => {
//     try {
//         //get categoryId
//         const {categoryId} = req.body
    
//         //get courses for specified categoryId
//         const selectedCategory = await Category.findById(categoryId)
//                                         .populate("courses")
//                                         .exec()
//         //validation
//         if(!selectedCategory)
//             throw new ApiError(400, "Data not found")
//         //get courses for didferent categories
//         const differentCategories = await Category.find({
//                                             _id: {$ne: categoryId},
//                                         })
//                                         .populate("courses")
//                                         .exec()
//         //get top selling courses
    
//         //return response
//         return res
//         .status(200)
//         .json({
//             success: true,
//             message: "courses category fetched successfuly",
//             data: {
//                 selectedCategory,
//                 differentCategories
//             }
//         })
//     } catch (error) {
//         throw new ApiError(500, error)
//     }
// }


const categoryPageDetails = async( req, res) => {
    try {
        const { categoryId } = req.body
        const selectedCategory = await Category.findById(categoryId)
                                            .populate({
                                                path: "courses",
                                                populate: "ratingAndReviews"
                                            }).exec()
    
        if(!selectedCategory || selectedCategory.courses.length === 0)
            throw new ApiError(400, "no course found of selected Category")
    
        const  categoriesExceptSelected = await Category.find({
            _id : {$ne : categoryId},
        })
    
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
            .populate({
                path: "courses"
            }).exec()
    
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                populate: {
                    path: "instructor"
                }
            }).exec()
    
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
                                        .sort( (a,b) => b.sold - a.sold)
                                        .slice(0,10)
    
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        throw new ApiError(501, "Internal Server Error : ",error)
    }

}

export {
    createCategory,
    getAllCategory,
    categoryPageDetails
}