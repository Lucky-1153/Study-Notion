import { apiConnector } from "../apiConnector"
import toast from "react-hot-toast"
import {setUser} from '../../slices/profile.slice'
import {settingsEndpoints} from '../apis'
import {logout} from './authAPI'

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } = settingsEndpoints


export function updateDisplayPicture(token, formData){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{

            console.log("here it is")
            const response = await apiConnector( "PUT", UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                  }

            )
            console.log("where it is")
            

            console.log("UPDate display picrure api response --- ", response)

            if( !response.data.success)
                throw new Error(response.data.message)

            toast.success("Display Picture Updated Seccessfully")
            dispatch(setUser(response.data.data))
        } catch(error){
            console.log("update display picture api error ===== ", error)
            toast.error("could not update display picture")
        }
        toast.dismiss(toastId)
    }
}

export function updateProfile( token, formData){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success)
                throw new Error(response.data.message)

            // const userImage = response.data.updatedUserDetails.image ?
            //     response.data.updatedUserDetails.image
            //     : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
                
                dispatch(setUser({...response.data.updatedUserDetails}))

            toast.success("Profile Update Successfully")
        } catch(error){
            console.log("UPDATE PROFILE API ERROR -> ",error)
            toast.error("Could not Update Profile")
        }
        toast.dismiss(toastId)
    }

}


export async function changePassword( token, formData){
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST" , CHANGE_PASSWORD_API, formData,{
            Authorization: `Bearer ${token}`
        })

        console.log("change paoswrord api response ; ",response)

        if(!response.data.success)
            throw new Error(response.data.message)

        toast.success("Password changed successfullt")
    } catch(error){
        console.log("change passowrd api error...",error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}


export function deleteProfile( token, navigate){
    return async( dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`
            })

            console.log("DELETE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Profile Deleted Successfully")
            dispatch(logout(navigate))
        } catch(error){
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}