import mongoose ,{Schema} from "mongoose";

const ratingAndReviewSchema = new Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        rating: {
            type: Number,
            required: true,
        },

        review: {
            type: String,
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course",
            index: true,
        }
    }
)

export const RatingAndReview = mongoose.model('RatingAndReview', ratingAndReviewSchema)