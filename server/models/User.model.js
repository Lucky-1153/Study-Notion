import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'


const userSchema = new Schema ( 
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        accountType: {
            type: String,
            enum: ["Admin", "Instructor", "Student"],
            required: true
        },
        

        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            }
        ],

        image: {
            type: String,
            required: true
        },

        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseProgress'
            }
        ],

        refreshToken:{
            type: String
        },

        resetPasswordToken: {
            type: String,
        },

        resetPasswordTokenExpiry: {
            type: Date
        }

    },  {timestamps: true}
)

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        
        {
            _id: this._id,
            email: this.email,
            accountType: this.accountType,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET
        }
    )
}

export const User = mongoose.model('User', userSchema)