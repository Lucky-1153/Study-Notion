import mongoose , {Schema} from 'mongoose'

const profileSchema = new Schema (
    {
        gender: {
            type: String
        },

        dateOfBirth : {
            type: String,
        },

        about: {
            type: String,
            trim: true,
        },

        contactNumber: {
            type: Number,
            trim: true,
        }
         
    }, {timestamps: true}

)

export const Profile = mongoose.model("Profile", profileSchema)