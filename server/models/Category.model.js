import mongoose ,{Schema} from "mongoose";

const categorySchema = new Schema (
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    }
)

export const Category = mongoose.model('Category', categorySchema)