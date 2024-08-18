import {instance} from '../config/Razorpay.js'
import {Course} from '../models/Course.model.js'
import { User } from '../models/User.model.js'
import { ApiError } from '../utils/ApiError.js';
import {mailSender} from '../utils/mailSender.js'
import {courseEnrollmentEmail} from '../mail/templates/courseEnrollmentEmail.js'
import {paymentSuccessEmail} from '../mail/templates/PaymentSuccessEmail.js'
import mongoose from 'mongoose';
import { CourseProgress } from '../models/CourseProgress.model.js';

// const capturePayment = async(req, res) => {
//     //get courseId and User
//     const {course_id} = req.body;
//     const userId = req.user._id

//     if(!course_id)
//         throw new ApiError(400,"please provide valid course ID")

//     let course;
//     try{
//         course = await Course.findById(course_id)
//         if(!course)
//             throw new ApiError(400, "could not find the course")
//     }
//     catch(error){
//         throw new ApiError(500, error)
//     }

//     //order create
//     const amount = course.price
//     const currency = "INR"

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId
//         }
//     }

//     try{
//         //initialize the payment using razorpay
//         const paymentResponse = await instance.orders.create(options)
//         console.log(paymentResponse)

//         return res
//         .status(200)
//         .json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     }
//     catch(error){
//         throw new ApiError(500, "could not initiate order")
//     }

// }

// const verifySignature = async( req, res) => {
//     const webhookSecret = '123456'
    
//     const signature = req.headers["x-razorpay-signature"]

//     const shasum = crypto.createHmac("sha256", webhookSecret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest("hex")

//     if(signature === digest){
//         console.log("Payment is Authorized")

//         const { courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//             //fullfil the action

//             //find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id: courseId}, 
//                 {
//                     $push: {
//                         studentEnrolled: userId,
//                     }
//                 },
//                 {new: true}
//             )

//             if(!enrolledCourse)
//                 throw new ApiError(400, "Course not found")

//             console.log(enrolledCourse)

//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id: userId},
//                 {
//                     $push: {
//                         courses: courseId
//                     }
//                 },
//                 {
//                     new: true
//                 }
//             )

//             if(!enrolledStudent)
//                 throw new ApiError(401, "Student not found")

//             //send confermation link
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from lucky",
//                 "Congratulation, you are onboard into study notion"
//             )

//             console.log(emailResponse)
//             return res
//             .status(200)
//             .json({
//                 success: true,
//                 message: "Signature verfied and courese added"
//             })

//         }

//         catch(error){
//             throw new ApiError(500, error)
//         }
        
//     }
//     else
//         throw new ApiError(501, "invalid request")
// }

const capturePayment = async(req, res) => {
    const {courses} = req.body
    const {userId} = req.user.id

    if(courses.length === 0){
        return res.json({success: false, message: "Please provide Course Id"})
    }

    let totalAmount = 0

    for (const courseId of courses) {
        let course 
        try{
            course = await Course.findById(courseId)


            if(!course) {
                return res
                .status(200)
                .json({success: false, message: "Could not find the course"})
            }

            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentsEnrolled.includes(uid))
                throw new ApiError(444, "Student is already enrolled")

            totalAmount += course.price
        } catch(error){
            throw new ApiError(400, error)
        }
    }
    
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString()
    }

    try{
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        return res
        .json({
            success: true,
            data: paymentResponse,
        })
    } catch(error){
        throw new ApiError(444, "Could not initiate Order.",error)
    }
    
}


//Verify Payments
const verifyPayment = async (req, res) => {
    const razorpayOrderId = req.body?.razorpay_order_id
    const razorpayPaymentId = req.body?.razorpayPaymentId
    const razorpaySignature = req.body?.razorpaySignature
    const courses = req.body?.courses
    const userId = req.user._id

    if (
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature ||
        !courses ||
        !userId
      ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
      }

    let body = razorpayOrderId + "|" + razorpayPaymentId

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")

    if(expectedSignature === razorpaySignature){
        await enrollStudents(courses, userId, res)
        return res
        .status(200)
        .json({
            success: true,
            message: "Payment Verified"
        })
    }

}

const enrollStudents = async(courses, userId, res) => {
    if( !courses || userId) {
        throw new ApiError(300, "Please provide CourseId and UserId")
    }

    for( const courseId of courses) {
        try {
            const enrolledCourse  = await User.findOneAndUpdate(
                { _id : courseId },
                { $push : {
                    studentsEnrolled : userId
                }},
                {
                    new : true,
                }
            )

            if (!enrolledCourse) {
                return res
                  .status(500)
                  .json({ success: false, error: "Course not found" })
              }
              console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseId : courseId,
                userId : userId,
                completedVideos: []
              })
            
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses : courseId,
                        courseProgress : courseProgress._id
                    }
                }
            )

            console.log("Enrolled Student: ", enrolledStudent)

            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}` 
                )
            )

            console.log("Email sent Successfully : ", emailResponse.response)

             

        } catch (error) {
            throw new ApiError(500, error)
        }
    }
}

const sendPaymentSuccessEmail = async( req, res) => {
    const {orderId, paymentId, amount} = req.body

    const userId = req.user._id

    if(
        !orderId ||
        !paymentId ||
        !amount ||
        !userId 
    )

    try{
        const enrolledStudent = await User.findById(userId)

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId,
                paymentId
            )
        )
    } catch(error){
        throw new ApiError(500, "Could not send email",error)
    }

}


export {
    capturePayment,
    verifyPayment,
    enrollStudents,
    sendPaymentSuccessEmail
}