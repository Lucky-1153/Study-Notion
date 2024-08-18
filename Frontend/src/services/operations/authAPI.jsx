import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/auth.slice"
import { setUser } from '../../slices/profile.slice'
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"
import { resetCart } from "../../slices/cart.slice"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints


export function logout(navigate){
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // localStorage.clear()
    toast.success("Logged Out")
    navigate("")
  }
}



export function login(email, password, navigate){
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try{
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password
      })

  

      if(!response.data.success)
          throw new Error(response.data.message)
      console.log("reponse of login is",response)
  

      toast.success("Login Successful")
      dispatch(setToken(response.data?.accessToken))
      const userImage =await response.data?.createdUser?.image 
        ? response.data.createdUser.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
        dispatch(setUser({ ...response.data.createdUser, image: userImage}))
      
      

      localStorage.setItem("token", JSON.stringify(response.data.accessToken))
      console.log("token oyeee..",response.data.accessToken)
  
      localStorage.setItem("user", JSON.stringify(response.data.createdUser))
      navigate("/dashboard/my-profile")
    } catch(error){
      console.log("LOGIN API ERROR .......", error)
      toast.error(toastId)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}





export function getPasswordResetToken(email, setEmailSent){
  return async(dispatch) => {
      dispatch(setLoading(true))
      try{
        const response = await apiConnector("POST", RESETPASSTOKEN_API, {
          email
        })
        if(!response.data.success)
          throw new Error(response.data.message)

        toast.success("Rest Email Sent")
        setEmailSent(true)
      } catch(error){
        console.log("RESET passowrd API error", error)
        toast.error("Failed to send email for resetttnig paswrord")
      }
      dispatch(setLoading(false))
  }
}

export function resetPassword (password, confirmPassword, token){
  return async(dispatch) => {
    console.log("before loading")
    dispatch(setLoading(true))
    console.log("after loading")
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password, confirmPassword, token
      })

      console.log("Reset password response is ...",response)

      if(!response.data.success)
        throw new Error(response.data.message)

      toast.success("Password has been reset successfuly")
    } catch(error){
      console.log("RESET Passwrod Token error", error)
      toast.error("Unable to reset password")
    }
    dispatch(setLoading(false))
  }
}


export function sendOtp(email, navigate){
    return async(dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try{
        const response = await apiConnector("POST", SENDOTP_API, {
          email,
          checkUserPresent: true
        })
  
        console.log(response)
        if(!response.data.success)
          throw new Error(response.data.message)
  
        toast.success("OTP Sent Successfuly")
        navigate("/verifyEmail")
      } catch(error){
        console.log("SENDOTP API ERROR.........", error)
        toast.error("could not send otp")
      }
  
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  
  export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
  ){
      return async(dispatch) => {
        // const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
          console.log("hii there")
          const response = await apiConnector("POST", SIGNUP_API,{
            firstName,
            lastName,
            accountType,
            email,
            password,
            confirmPassword,
            otp
          })
console.log("mee too")
          if(!response.data.success)
            throw new Error(response.data.message)
  
          toast.success("Signup Successful")
          navigate("/login")
        } catch(error){
          console.log("Signup API ERROR", error)
          console.log("hii")
          toast.error("SIGNUP FAILED")
          navigate("/signup")
        }
        dispatch(setLoading(false))
        // toast.dismiss(toastId)
      }
  }
