import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import {mailSender} from '../utils/mailSender.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'


//reset Password Token
const resetPasswordToken = async(req, res) => {
    try{
        const {email} = req.body

        const user = await User.findOne({email})

        if(!user)
            throw new ApiError(401, "Invalid email")

        const token = crypto.randomBytes(20).toString("hex")

        const updatedUser = await User.findOneAndUpdate(
            {email: email},
            {
                resetPasswordToken : token,
                resetPasswordTokenExpiry: Date.now() + 5 * 60 * 1000
            },
            {
                new : true,
            }
        )
        console.log("no error here")
        const url = `http://localhost:5173/updatePassword/${token}`

        await mailSender(email, 'Password Reset Link', `Password reset Link : ${url}`)

        return res
        .status(200)
        .json({
            success: true,
            message: "email sent successfully",
            
        })

    }
    catch(error){
        throw new ApiError(402, "unable to send reset password link",error)
    }
}

const resetPassword = async(req, res) => {

    try {
        const {password, confirmPassword, token} = req.body

       
    
        if (!token || !password || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "All fiels are required...!"
            });
        }

        if( password !== confirmPassword)
            throw new ApiError(401, "passowrd doesn't match")
    
        const userDetails = await User.findOne({resetPasswordToken: token})
        console.log(userDetails)
    
        if(token !== userDetails.resetPasswordToken){
            return res.status(401).json({
                success: false,
                message: 'Password Reset Token does not match'
            })
        }
    
        //check token expiry
        if((userDetails.resetPasswordTokenExpiry < Date.now())){
            throw new ApiError(402, "token expired")
        }
    
        //hash new password and then save
        const hashedPassword = await bcrypt.hash(password, 10)
    
        await User.findOneAndUpdate(
            {resetPasswordToken: token},
            {
                password: hashedPassword
            },
            {
                new: true
            }
        )
    
        return res
        .status(200)
        .json({
            success: true,
            message: "password changed successfully"
        })
    } catch (error) {
        throw new ApiError(500, "unable to change password",error)
    }



}

export {
    resetPassword,
    resetPasswordToken
}