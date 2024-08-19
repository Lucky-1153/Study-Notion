import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

import rzpLogo from '../../assets/Logo/rzp_logo.png'
import {setPaymentLoading} from '../../slices/course.slice'
import {resetCart} from '../../slices/cart.slice'

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints

function loadScript(src) {
    return new Promise( (resolve) => {
        const script = document.createElement('script')

        script.src = src

        script.onload = () => {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script)
    })
}


export async function buyCourse( token, courses, userDetails, navigate, dispatch){
    const toastId = toast.loading('Loading...')
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load")
            return
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses},
            {Authorization : `Bearer ${token}`}
        )

        console.log("PRInting orderResponse : ",orderResponse)
        console.log('printing user details: ', userDetails)

        const options = {
            key: import.meta.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name:"StudyNotion",
            descrption: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            
            handler: function (response) {
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token)
                verifyPayment({...response, courses}, token, navigate, dispatch)
            },
            method: {
                upi: true, // enable UPI payment method
                qr_code: true, // enable QR code payment method
            },
            // config: {
            //     display: {
            //       block: ['upi'], // Focus on showing UPI (it usually handles QR code)
            //       block: ['qr_code'], // Add this if you want to force a separate QR code option
            //     }
            //   }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed")
            console.log(response.error)
        })

        console.log("kjkjlkfdjkfjld")
    }catch(error){
        console.log("Payment api error...", error)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token){
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpayOrderId,
            paymentId: response.razorpayPaymentId,
            amount,
        },{
            Auhorization: `Bearer ${token}`
        })
    } catch (error) {
        throw new Error(333, "Payment Success email error... ")
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Loading...")
    dispatch(setPaymentLoading(true))
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.success){
            throw new Error( response.data.message)
        }

        toast.success("payment seccessfull, you are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())

    } catch (error) {
        console.log("Payment verify error...", error)
        toast.error("COuld not verify payment")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}
