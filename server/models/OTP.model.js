import mongoose,{Schema} from "mongoose";
import {mailSender} from '../utils/mailSender.js'

const OTPSchema = new Schema (
    {
        email: {
            type: String,
            required: true,
        },

        otp: {
            type: String,
            required: true,
        },
 
        createdAt: {
            type: Date,
            default : Date.now(),
            expires: 5*60,
        }
    }
)

async function sendVerificationEmail( email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otp);
        console.log("email sent successfuly", mailResponse)
    }
    catch(error){
        console.log("error occured while sending mails: ", email)
        throw new error
    }
}

OTPSchema.pre("save", async function (next){
    await sendVerificationEmail(this.email, this.otp)
    next()
})

export const OTP = mongoose.model('OTP', OTPSchema)