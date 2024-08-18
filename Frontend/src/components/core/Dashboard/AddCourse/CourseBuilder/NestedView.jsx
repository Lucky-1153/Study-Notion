import React, { useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { MdEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { RxDropdownMenu } from 'react-icons/rx'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { FaPlus } from "react-icons/fa"

import {
    deleteSection,
    deleteSubSection,
} from '../../../../../services/operations/CourseDetailsApi'
import { setCourse } from '../../../../../slices/course.slice'
import confirmationModal from '../../../../Common/ConfirmationModal'
import SubSectionModal from './SubSectionModal'

const NestedView = ( {handleChangeEditSectionName}) => {

    const {course} = useSelector( (state) => state.course)
    const {token} = useSelector( (state) => state.auth)
    const dispatch = useDispatch()
    
    //states to keep track of mode of moad[add, view, edit]
    const [addSubSection, setAddSubSection] = useState(null)
    const [viewSubSection, setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null)

    //to keep track of confirmation modal
    const [confirmationModal, setConfirmationModal] = useState(null)

    const handleDeleteSection = async( sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token,
        })
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null)
    }

    const handleDeleteSubSection = async(subSectionId, sectionId) => {
        const result = await deleteSubSection({ subSectionId, sectionId, token})
        if(result){
            //update the structure of course
            const updatedCourseContent = course.courseContent.map((section) => 
                section._id === sectionId ? result : section
            )

            const updatedCourse = { ...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
    }

  return (
    <>
        <div
            className="rounded-lg bg-richblack-700 p-6 px-8"
            id="nestedViewContainer"
        >

            {course?.courseContent?.map((section) => (
                //Section dropdown
                <details key={section._id} open>
                    {/* Sectokn Dropdown content */}
                    <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                        <div className="flex items-center gap-x-3">
                            <RxDropdownMenu   className="text-2xl text-richblack-50"/>
                            <p className="font-semibold text-richblack-50">
                                {section.sectionName}
                            </p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <button onClick={() => handleChangeEditSectionName(
                                section._id,
                                section.sectionName
                            )}>
                                <MdEdit className="text-xl text-richblack-300" />
                            </button>
                            <button 
                                onClick={ () => seConfirmationModal({
                                    text1: "Delete this Section?",
                                    text2: "All the lectures in this section will be deleted",
                                    btn1Text: "Delete",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => handleDeleteSection(section._id),
                                    btn2Handler: () => setConfirmationModal(null),
                                })}
                            >
                                <RiDeleteBin6Line className="text-xl text-richblack-300" />
                            </button>
                            <span className="font-medium text-richblack-300">|</span>
                            <AiFillCaretDown className={`text-xl text-richblack-300`} />
                        </div>
                    </summary>
                    <div className="px-6 pb-4">
                        {/* Render all sub section within a section */}
                        { 
                            console.log("subSection name",section)
                        }
                        {
                            section.subSection.map((data) => (
                                <div
                                    key={data?._id}
                                    onClick={() => setViewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                > 
                                    <div  className="flex items-center gap-x-3 py-2 ">
                                        <RxDropdownMenu className="text-2xl text-richblack-50"  />
                                        <p className="font-semibold text-richblack-50">
                                            {data.title}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-x-3">
                                        <button
                                            onClick={() => setEditSubSection({...data, sectionId: section._id})}
                                        >
                                            <MdEdit className="text-xl text-richblack-300"/>
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmationModal({
                                                  text1: "Delete this Sub-Section?",
                                                  text2: "This lecture will be deleted",
                                                  btn1Text: "Delete",
                                                  btn2Text: "Cancel",
                                                  btn1Handler: () =>
                                                    handleDeleteSubSection(data._id, section._id),
                                                  btn2Handler: () => setConfirmationModal(null),
                                                })
                                              }
                                        >
                                            <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                        </button>
                                    </div>
                                    
                                </div>
                            ))
                        } 
                        { 
                            console.log("another subSection name",section?.subSection?.title)
                        }
                        {/* Add New Lecture to Section */}
                        <button 
                            className="mt-3 flex items-center gap-x-1 text-yellow-50"
                            onClick={() => setAddSubSection(section._id)}
                        >
                            <FaPlus className="text-lg" />
                            <p>Add Lecture</p>
                        </button>
                    </div>

                </details>
            ))}
        </div>

        
        {/* Modal Display */}
        {addSubSection ? (
            <SubSectionModal 
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
            />
        ) : viewSubSection ? (
            <SubSectionModal 
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
            />
        ) : editSubSection ? (
            <SubSectionModal 
                modalData ={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
            />
        ) : (
            <></>
        )}

        {/* Confirmation Modal */}
        {confirmationModal ? (
            <ConfirmationModal modalData={confirmationModal} />
        ) : (
            <></>
        )}
    </>
  )
}

export default NestedView