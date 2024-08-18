import { current } from '@reduxjs/toolkit'
import React, { useRef, useEffect, useState } from 'react'
import { IoMdRestaurant } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"
import { markLectureAsComplete } from '../../../services/operations/CourseDetailsApi'
import { updateCompletedLectures } from '../../../slices/viewCourse.slice'
import IconBtn from '../../Common/IconBtn'


const VideoDetails = () => {

    const {courseId, sectionId, subSectionId} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const playerRef = useRef(null)
    const dispatch = useDispatch()
    const { token } = useSelector( (state) => state.auth)
    const {courseSectionData, courseEntireData, completedLectures } = useSelector( (state) => state.viewCourse)

    const [videoData, setVideoData] = useState([])
    const [previewSource, setPreviewSource] = useState("")
    const [videoEnded, setVideoEnded ] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("video data", videoData)
        console.log("coure section data", courseSectionData)
        console.log("compeleted videos", completedLectures)
        console.log('course entire data', courseEntireData)
    },[videoData])

    useEffect( () => {
        console.log("berofe aftekjfkdjlsfjl")
        ;(async() => {
            if(!courseSectionData.length) {
                console.log("coursesectiondata",courseSectionData)
                return
            }
            if(!courseId && !sectionId && !subSectionId){
                console.log("mooooooof")
                navigate('/dashboard/enrolled-course')
            } else{
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                ) 
     
                const filteredVideoData = filteredData?.[0]?.subSection.filter((data) => data._id === subSectionId)
                
                console.log("filtered videodat",filteredVideoData)
                setVideoData(filteredVideoData)
                setPreviewSource(courseEntireData.thumbnail)
                setVideoEnded(false)
            }
        })()
    },[courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndx = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndx === 0 && currentSubSectionIndx === 0){
            return true
        } else return false
    }

    const  isLastVideo = () => {
        const currentSectionIndx  = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndx].subSection.length

        const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndx === courseSectionData.length - 1 && 
            currentSubSectionIndx === noOfSubSections - 1
        ) return true
        else return false
    }

    const goToNextVideo = async() => {
        const currentSectionIndx = courseSectionData.findIndex( (data) => data._id === sectionId)

        const noOfSubSection = courseSectionData[currentSectionIndx].subSection.length

        const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)
        console.log("current section indx",currentSectionIndx)
        console.log("no of subSections",noOfSubSection)
        console.log("current sub Section index",currentSubSectionIndx)
        if(currentSubSectionIndx !== noOfSubSection - 1){
            const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        } else{
            const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
            const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = async() => {
        const currentSectionIndx = courseSectionData.findIndex( (data) => data._id === sectionId)

        const noOfSubSection = courseSectionData[currentSectionIndx].subSection.length

        const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)

        if( currentSubSectionIndx !== 0){
            
            const prevSubSectionVideo = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionVideo}`)
        }   else{
            console.log('prevsubSectiondata',courseSectionData[currentSectionIndx - 1]._id)
            const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
            const prevSubSectionLength =
                courseSectionData[currentSectionIndx - 1].subSection.length
            const prevSubSectionId =
                courseSectionData[currentSectionIndx - 1].subSection[
                prevSubSectionLength - 1
                ]._id
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
            )
        }

    }

    const handleLectureCompletion = async() => {
        setLoading(true)
        const res = await markLectureAsComplete(
            {
                courseId: courseId,
                subSectionId: subSectionId
            },
            token
        )
        if(res){
            dispatch(updateCompletedLectures(subSectionId))
        }
        setLoading(false)
    }

  return (
    <div className="flex flex-col gap-5 text-white">
        
        {!videoData ? (
            <div>
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
                {console.log("video data not found")}
            </div>
            
        ) : (
            <Player
                ref={playerRef}
                aspectRatio="16:9"
                playsInline 
                onEnded={() => setVideoEnded(true)}
                src={videoData?.[0]?.videoUrl}
            >
                <BigPlayButton position='center' />
                {/* Render When Video Ends */}
                {videoEnded && (
                    <div 
                    style={{
                        backgroundImage:
                          "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                      }}
                      className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                    >
                        {!completedLectures.includes(subSectionId) &&  (
                            <IconBtn 
                                disabled={loading}
                                onclick={() => handleLectureCompletion()}
                                text={loading ? "Loading..." : "Mark as Completed"}
                                customClasses = "text-xl max-w-max px-4 mx-auto"
                            />
                        )}
                        <IconBtn 
                            disabled={loading}
                            onclick={() => {
                                if(playerRef?.current) {
                                    playerRef?.current?.seek(0)
                                    setVideoEnded(false)
                                }
                            }}
                            text="Rewatch"
                            customClasses = "text-xl max-w-max px-4 mx-auto mt-2"
                        />
                        <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                            {
                                !isFirstVideo() && (
                                    <button
                                        disabled ={loading}
                                        onClick={goToPrevVideo}
                                        className='blackButton'
                                    >
                                        Prev
                                    </button>
                                ) 
                            }
                            {
                                !isLastVideo() && (
                                    <button
                                        disabled = {loading}
                                        onClick={goToNextVideo}
                                        className='blackButton'
                                    >
                                        Next
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )

                }
            </Player>
        )
        }
        {console.log("video data",videoData)}
        <h1  className="mt-4 text-3xl font-semibold">{videoData?.[0]?.title}</h1>
        <p className="pt-2 pb-6">{videoData?.[0]?.description}</p>

     
    </div>
  )
}

export default VideoDetails