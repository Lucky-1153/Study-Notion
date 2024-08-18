import toast from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis"
import { ApiError } from "../../../server/utils/ApiError";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } = profileEndpoints

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading")
    let result = []
    
    try {
        const res = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
            Authorization: `Bearer ${token}`
        })
       
        console.log("response of get user enrolled courses api is : ", res)

        if(!res)
            throw new Error("response is not avialbale in enroll course api")

        result = res.data.data

    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try{
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}`
        })
        console.log("Get Instructor api Response is ", response)
        result = response?.data?.courses
    } catch(error) {
        console.log("GetInstructor api error", error)
        toast.error("Could not Get Instructor Data")
    }
    toast.dismiss(toastId)
    return result
}