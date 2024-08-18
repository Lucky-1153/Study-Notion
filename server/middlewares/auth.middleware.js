import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.model.js'

const auth = async(req , res, next) => {
    try {
        const token = req.cookies?.accessToken ||
                      req.body.token ||
                      req.header("Authorization").replace("Bearer ","")
        if( !token)
            throw new ApiError(401, "no token found")

        console.log("token is ...... ",token)

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-refreshToken")
        if(!user)
            throw new ApiError(402,"invalid token")

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(403, "unable to verify the user",error)
    }
}

const isStudent = async( req, res, next) => {
    try {
        if( req.user?.accountType !== 'Student')
            throw new ApiError(401, "this protected route only for students")

        next()

    } catch (error) {
        throw new ApiError(402, "unable to verfiy that it is a student")
    }
}

const isInstructor = async( req, res, next) => {
    try {
        if( req.user?.accountType !== 'Instructor')
            throw new ApiError(401, "this protected route only for Instructor")

        next()

    } catch (error) {
        throw new ApiError(402, "unable to verfiy that it is a Instructor")
    }
}

const isAdmin = async( req, res, next) => {
    try {
        if( req.user?.accountType !== 'Admin')
            throw new ApiError(401, "this protected route only for Admin")

        next()

    } catch (error) {
        throw new ApiError(402, "unable to verfiy that it is a Admin")
    }
}

export{
    auth,
    isAdmin,
    isStudent,
    isInstructor
}