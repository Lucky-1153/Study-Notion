import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../../../../services/operations/CourseDetailsApi'
import {setCourse, setEditCourse } from '../../../../slices/course.slice'
import { useDispatch, useSelector } from 'react-redux'
import RenderSteps from '../AddCourse/RenderSteps'


const index = () => {

    const dispatch = useDispatch()
    const { courseId } = useParams()
    const { course } = useSelector( (state) => state.course)
    const [loading, setLoading] = useState(false)
    const {token} = useSelector( (state) => state.auth)

    useEffect( () => {
        ;(async() => {
            setLoading(true)
            const result = await getFullDetailsOfCourse(courseId, token)
            console.log('course full details are of the you ',result)
            if(result?.courseDetails){
                dispatch(setEditCourse(true))
                dispatch(setCourse(result?.courseDetails))
            }
            setLoading(false)
        })()    
    },[])

    if (loading) {
        return (
          <div className="grid flex-1 place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Course
        </h1>
        <div className="mx-auto max-w-[600px]">
            {course ? (
                <RenderSteps />
            ) : (
                <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                    Course not found 
                </p>
            )}
        </div>
    </div>
  )
}

export default index