import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { editCourseDetails } from '../../../../../services/operations/CourseDetailsApi'
import { resetCourseState } from '../../../../../slices/course.slice'
import {COURSE_STATUS} from '../../../../../utils/Constants'
import IconBtn from '../../../../Common/IconBtn'

const index = () => {

    const {
        register,
        handleSubmit,
        setValue, 
        getValues,
    } = useForm()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {token} = useSelector( (state) => state.auth)
    const {course} = useSelector( (state) => state.course)
    const [loading, setLoading] = useState(false)

    useEffect( () => {
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true)
        }
    },[])

    const goBack = () => {
        dispatch(setStep(2))
    }


    const goToCourses = () => {
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async () => {
        //chekc if form has been updateed or not
        if(
            (course?.status === COURSE_STATUS.PUBLISHED && 
                getValue("public") === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValue("publis") === false)
        ){
            //form has not been updated
            // no need to make api call
            goToCourses()
            return
        }

        const formData = new FormData()
        formData.append("courseId", course._id)
        const courseStatus = getValues("public")
        ? COURSE_STATUS.PUBLISHED
        : COURSE_STATUS.DRAFT
        formData.append("status", courseStatus)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        if (result) {
        goToCourses()
        }
        setLoading(false)

    }

    const onSubmit = (data) => {
        // console.log(data)
        handleCoursePublish()
    }

  return (
    <div>
        <p>
            Publish Settings
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* CheckBox */}
            <div>
                <label htmlFor="public">
                    <input 
                        type='checkbox'    
                        id='public'
                        {...register("public")}
                    />
                    <span>
                        Make this course as public
                    </span>
                </label>
            </div>

            {/* Next prev button */}
            <div>
                <button
                    disabled={loading}
                    type='button'
                    onClick={goBack}

                >
                    Back
                </button>
                <IconBtn 
                    disabled={loading}
                    text="Save Changes"
                />
            </div>
        </form>
    </div>
  )
}

export default index