import {toast} from "react-hot-toast"
 
import {apiConnector} from "../apiConnector"
import {courseEndpoints} from '../apis'

import { setCourseSectionData } from "../../slices/viewCourse.slice"

const {
COURSE_DETAILS_API,
COURSE_CATEGORIES_API,
GET_ALL_COURSE_API,
CREATE_COURSE_API,
EDIT_COURSE_API,
CREATE_SECTION_API,
CREATE_SUBSECTION_API,
UPDATE_SECTION_API,
UPDATE_SUBSECTION_API,
DELETE_SECTION_API,
DELETE_SUBSECTION_API,
GET_ALL_INSTRUCTOR_COURSES_API,
DELETE_COURSE_API,
GET_FULL_COURSE_DETAILS_AUTHENTICATED,
CREATE_RATING_API,
LECTURE_COMPLETION_API,
} = courseEndpoints

export const addCourseDetails = async( data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
  
    try{
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type" : "multipart/form-Data",
            Authorization: `Bearer ${token}`
        })
        console.log("Create course api response.........", response)
        
        if(!response?.data?.success)
            throw new Error("Could not add course details")
        console.log("everything is ok")
        toast.success("Course details added successfully")
        result = response?.data?.data
       
    } catch(error){
        console.log("create course api error....", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
    
}

export const editCourseDetails = async(data, token ) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", EDIT_COURSE_API, data,{
            "Content-Types" : "multipart/formData",
            Authorization : `Bearer ${token}`
        })

        console.log("Edit Course Api Response......", response)

        if(!response)
            throw new Error("Not able to edit course details")

        toast.success("Course Details Updted Successsfully")
        result = response?.data

    } catch(error){
        console.log("error while editing course...",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseCategories = async() => {
    let result =[]
    try{
        const response = await apiConnector("GET", COURSE_CATEGORIES_API)
        console.log("Course categorires fetched api response....", response)
        if(!response)
            throw new Error("not able to fethc the categories")

        toast.success("Course Categories fetched successfully")

        result = response?.data?.getAllCategory
    } catch(error){
        console.log("error while fetching course categories...", error)
        toast.error(error.message)
    }
    return result
}

export const createSection = async( data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    console.log("here is courseId  ",data?.courseId)
    try{
        const response = await apiConnector("POST", CREATE_SECTION_API, data,{
            Authorization : `Bearer ${token}`
        })

        console.log("CREATE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could Not Create Section")
        }
        toast.success("Course Section Created")
        result = response?.data?.updatedCourseDetails
    } catch (error) {
        console.log("CREATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async( data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
            Authorization: `Bearer ${token}`
        })
        console.log("UPDATE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
        throw new Error("Could Not Update Section")
        }
        toast.success("Course Section Updated")
        result = response?.data?.data
    } catch (error) {
        console.log("UPDATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// delete a section
export const deleteSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", DELETE_SECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Section")
      }
      toast.success("Course Section Deleted")
      result = response?.data?.data
    } catch (error) {
      console.log("DELETE SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  //create sub section
  export const createSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE SUB-SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Lecture")
      }
      toast.success("Lecture Added")
      result = response?.data?.data
    } catch (error) {
      console.log("CREATE SUB-SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }
  // delete a subsection
  export const deleteSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE SUB-SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Lecture")
      }
      toast.success("Lecture Deleted")
      result = response?.data?.data
    } catch (error) {
      console.log("DELETE SUB-SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  //UPDATE SUB SECTION

  export const updateSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE SUB-SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Lecture")
      }
      toast.success("Lecture Updated")
      result = response?.data?.data
    } catch (error) {
      console.log("UPDATE SUB-SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = []
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getCourseDetails = async(courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try{
    console.log("once more ",courseId)
    const response = await apiConnector("POST", COURSE_DETAILS_API, {courseId})
    console.log("here two")
    console.log("course details api response is :",response)
    if(!response)
      throw new Error("COuld not get course details")

    result = response.data
  } catch(error){
    console.log('COURSE DETAILS API ERROR... ',error)
    toast.error(error)
  }
  toast.dismiss(toastId)
  return result
  
}

export const createRating = async(data, token) => {
  const toastId = toast.loading("Laoding...")
  let success = true
  try{
    
    const response = await apiConnector("POST" , CREATE_RATING_API, data ,{
      Authorization: `Bearer ${token}`
    })
    console.log("hellow ji")
    
    console.log("Create rating api response.........", response)
    if(!response?.data?.success)
      throw new Error("could nt create rating")

    toast.success("Rating Created")
    success = true
  } catch(error) {
    success = false
    console.log("create rating api error....", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}

export const markLectureAsComplete = async(data, token) => {
  let result = null
  console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`
    })
    console.log("mark complete data")
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    )

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  }catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}

export const getFullDetailsOfCourse = async(courseId, token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try{
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSEfdfdfdfd............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  }catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  
  return result
}