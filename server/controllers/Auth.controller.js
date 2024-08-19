import { User } from "../models/User.model.js";
import  {OTP}  from '../models/OTP.model.js'
import { ApiError } from "../utils/ApiError.js";
import otpGenerator from 'otp-generator'
import bcrypt from 'bcrypt'
import {Profile} from '../models/Profile.model.js'
import {mailSender} from '../utils/mailSender.js'
import {otpTemplate} from '../mail/templates/emailVerificationTemplate.js'
import {passwordUpdated} from '../mail/templates/passwordUpdate.js'

const options = {
    httpOnly : true,
    secure: true,
   
    sameSite: 'none',

}

const generateTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
    
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
    
        user.refreshToken = refreshToken
    
        user.save({validationBefore: false})
    
        return  {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(401, "unable to generate tokens", error)
    }
}

const sendOTP = async ( req, res) => {

    try{
        //take email from body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email})

        if(checkUserPresent)
            throw new ApiError(401, "user already pressent")

        const otp =  otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        console.log("otp genrated : ",otp)

        let result = await OTP.findOne( {otp})

        while(result){

            otp = otpGenerator.generate(5,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({otp})
        }

        const otpPayload = {email, otp}

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)

        // return response successfully
        return res
        .status(200)
        .json(  
            {
                success:true,
                message:"OTP sent successfuly",
                otp,
            }
        )

    }
    catch(error){
        throw new ApiError(402, "error while genrating otp",error)
    }
}

const signUp = async (req, res) => {
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        if( [firstName, lastName, email, password, confirmPassword, accountType, otp].some((field) => field?.trim() === ""))
            throw new ApiError(401, "enter the all the details")

        // check both pass matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                messgae: 'passowrd & confirm password does not match, Please try again..!'
            });
        }

        const existedUser = await User.findOne({email})

        if(existedUser)
            throw new ApiError(402, "user already exist")

        //find most recent otp stored
        const recentOtp = await OTP.findOne({email}).sort({createdAt: -1}).limit(1)
        // if(!recentOtp)
        //     throw new ApiError(300,"recentOtp not founds")

        console.log("hiiii ")
        console.log(recentOtp)
        // .sort({ createdAt: -1 }): 
        // It's used to sort the results based on the createdAt field in descending order (-1 means descending). 
        // This way, the most recently created OTP will be returned first.
        // .limit(1): It limits the number of documents returned to 1.

        if(recentOtp.length == 0)
            throw new ApiError(403, "otp not found in database")

        else if( otp !== recentOtp.otp)
            throw new ApiError(404, "Invalid otp")

        const hashedPassword = await bcrypt.hash(password, 10)

        //entry create in database
        const profileDetails = await Profile.create({
            gender: null,
            datOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            accountType,
            password: hashedPassword,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })

        return res
        .status(200)
        .json({
            success: true,
            message: "User is registered successfuly",
        })
    }
    catch(error){
        throw new ApiError(405, "unaable to register user",error)
    }
}

//================login===========================
const logIn = async( req, res) => {
    
    try {
        const {email, password} = req.body
    
        if( [email, password].some( (field) => field.trim() === ""))
            throw new ApiError(401, "enter email and password")
    
        const user = await User.findOne({email})

        if(!user)
            throw new ApiError(402, "unauthorized access")
    
        //check if password is corect
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect)
            throw new ApiError(405,"password incorrect")
    
        const {accessToken, refreshToken} = await generateTokens(user._id)

        //in another way can  also generate token here
        // const payloadAccess = {
        //     _id: user._id,
        //     email : user.email,
        //      role: user.accountType
        // }
        // const payloadRefresh = {
        //     _id: user._id,
        // }
        // const accessToken = jwt.sign(payloadAccess, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "2h"} )
        // const refreshToken = jwt.sign(payloadRefresh, process.env.REFRESH_TOKEN_SECRET, {expiresIn : "72h"})
    
        const createdUser = await User.findById(user._id).select( "-password -refreshToken")
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                success: true,
                message: "user login successful",
                accessToken,
                refreshToken,
                createdUser
            }
        )
    } catch (error) {
        throw new ApiError(402, "Unable to login", error)
    }

} 

const changePassword = async( req, res) => {
    try {
        const {oldPassword , newPassword} = req.body
    
        if(!oldPassword || !newPassword)
            throw new ApiError(400, "all fields are required")
    
        const userDetails = await User.findById(req.user._id)
    
        const isPasswordCorrect = await bcrypt.compare(oldPassword, userDetails.password)
        
    
        if(!isPasswordCorrect)
            throw new ApiError(402, "old Passowrd is incoorect")
    
        // if( newPassword !== confirmPassword)
        //     throw new ApiError(404, "new password doen't match")
    
        const hashedPassowrd = await bcrypt.hash(newPassword, 10)
        
        const updatedUserdetails = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    password : hashedPassowrd
                }
            },
            {
                new: true,
            }
        )
    
        try {
            const emailResponse = await mailSender(
                updatedUserdetails.email,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserdetails.email,
                    `Password updated Successfully for ${updatedUserdetails.firstName} ${updatedUserdetails.lastName}`
                )
            )
        } catch (error) {
            throw new ApiError(406, "error occured while sending email : ",error)
        }
    
        return res
        .status(200)
        .json({
            success: true,
            message: "password changed successfuly"
        })
    } catch (error) {
        throw new ApiError(500, "Error while changing password", error)
    }
        
}

export {
    sendOTP,
    signUp,
    logIn,
    changePassword
}
