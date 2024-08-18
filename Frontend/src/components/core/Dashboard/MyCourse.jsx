import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VscAdd } from 'react-icons/vsc'
import { useSelector } from 'react-redux'

import { fetchInstructorCourses } from '../../../services/operations/CourseDetailsApi'
import IconBtn from '../../Common/IconBtn'
import CourseTable from './InstructorCourses/CoursesTable'

const MyCourse = () => {

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token)
            if(result)
                setCourses(result)
        }
        fetchCourses()
    },[])

  return (
    <div>
        <div>
            <h1>My Courses</h1>
            <IconBtn
                text="Add Course"
                onclick={()=> navigate("/dashboard/add-course")}
            >
                <VscAdd />
            </IconBtn>
        </div>
        {courses && <CourseTable courses = {courses} setCourses = {setCourses} />}
    </div>
  )
}

export default MyCourse