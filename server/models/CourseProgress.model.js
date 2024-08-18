import mongoose , {Schema} from 'mongoose'

const courseProgressSchema = new Schema (
    {
       courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
       },

       userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
       },

       completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
       ]
         
    }, {timestamps: true}

)

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)