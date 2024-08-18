import React from 'react'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import {getFullDetailsOfCourse} from '../services/operations/CourseDetailsApi'
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } from "../slices/viewCourse.slice"
import Footer from '../components/Common/Footer'

const ViewCourse = () => {

    const {courseId} = useParams()
    const { token } = useSelector( (state) => state.auth)
    const dispatch= useDispatch()
    const [reviewModal, setReviewModal] = useState(false)
    const[loading, setLoading] = useState(true)

    useEffect( () => {
        ;(async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token)
            console.log("courseData",courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            console.log("course section data",courseData.courseDetails.courseContent)
            dispatch(setEntireCourseData(courseData.courseDetails))
            console.log("ocurse entire data", courseData.courseDetails)
            dispatch(setCompletedLectures(courseData.completedVideos))
            console.log("course completed videos", courseData.completedVideos)
            setLoading(false)
            let lectures = 0
            courseData?.courseDetails?.courseContent?.forEach( (sec) => {
                lectures += sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        })()
    },[])

    if(loading){
        return (
            <div className='spinner object-center'></div>
        )
    }

  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            < VideoDetailsSidebar  setReviewModal = {setReviewModal} />
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                    <Outlet />
                </div>
            </div>
        </div>
        <Footer />
        {reviewModal && <CourseReviewModal setReviewModal = {setReviewModal} />}
    </>
  )
}

export default ViewCourse