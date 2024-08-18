import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import ChipInput from './ChipInput'
import { MdNavigateNext } from 'react-icons/md'
import RequirementsField from './RequirementsField'
import Upload from '../Upload'
import {toast} from "react-hot-toast"

import IconBtn from '../../../../Common/IconBtn'
import {setCourse, setStep} from '../../../../../slices/course.slice'
import {COURSE_STATUS} from '../../../../../utils/Constants'

import { 
  addCourseDetails, 
  editCourseDetails, 
  fetchCourseCategories } from '../../../../../services/operations/CourseDetailsApi'


const CourseInformationForm = () => {

  

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState : {errors}
  } = useForm()

  const dispatch = useDispatch()

  const {token} = useSelector( (state) => state.auth)
  const { course, editCourse} = useSelector( (state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect( () => {
    const getCategories = async () => {
      setLoading (true)
      const categories = await fetchCourseCategories()
      if(categories.length > 0)
        setCourseCategories(categories)
      
      setLoading(false)
    }

    console.log("coures before what you will learn",course)
    // console.log("what you will learn", course.whatYouWillLearn)
    //if form is in edit mode
    if( editCourse){
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenifits", course.whatYouWillLearn)
      setValue("courseCategory", course.category[0]._id)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }

    let currentValues = getValues()
    console.log("current values", currentValues)

    getCategories()
  },[])

  const isFormUpdated = () => {
    const currentValues = getValues()
    if(
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags !== course.tag ||
      currentValues.courseBenifits !== course.whatWillYouLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements !== course.instructions ||
      currentValues.courseImage !== course.thumbnail
    ) return true
    else return false
  }

  const onSubmit = async( data) => {

    if(editCourse) {
      if(isFormUpdated()){
        const currentValues = getValues()
        const formData = new FormData()

        formData.append("courseId", course._id)

        if(currentValues.courseTitle !== course.courseName)
          formData.append("courseName", data.courseTitle)

        if(currentValues.courseShortDesc !== course.courseDescription)
          formData.append("courseDescription", data.courseShortDesc)

        if(currentValues.coursePrice !== course.price)
          formData.append("price", data.coursePrice)

        if(currentValues.courseTags !== course.tag)
          formData.append("tag", data.courseTags)
        console.log("courseBenfiits",courseBenifits.value)

        if(currentValues.courseBenifits.value !== course.WhatYouWillLearn)
          formData.append("whatYouWillLearn", data.courseBenifits.value)
        // console.log("courseCategory is ",currentValues.courseCategory._id)
          console.log("course catefory is 2nd ",course.category[0]._id)
        if(currentValues.courseCategory._id !== course.category[0]._id)
          formData.append('category', data.courseCategory)

        if(currentValues.courseRequirements = course.instructions)
          formData.append("instruction", data.courseRequirements)

        if(currentValues.courseImage !== course.thumbnail)
          formData.append("thumbnail", data.courseImage)

        console.log("thumbnail....", data.courseImage)

        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if(result){
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else toast.error("No changes made to the form")

      return
    }

    let selectedValue = getValues("courseCategory")
   
    const formData = new FormData()
    console.log("category whatever", selectedValue.name)
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", data.courseTags)
    formData.append("whatYouWillLearn", data?.courseBenifits)
    formData.append("category", selectedValue.name)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", data.courseRequirements)
    formData.append("thumbnail", data.courseImage)
    
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    console.log("result is here",result)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
  
    }
    setLoading(false)
    
  }

  return (
        <form 
          className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2">
            <label 
              className="text-sm text-richblack-5" 
              htmlFor="courseTitle"> 
              Course Title <sup className='text-pink-200'>*</sup>
            </label>
            <input 
              type="text"
              id='courseTitle'
              placeholder='Enter Course Title'

              {
                ...register("courseTitle", {required: true})
              }
                className="form-style w-full"
            />
            {
              errors.courseTitle && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Course title is requried
                </span>
              )
            }
          </div>
          {/* Course Short Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
              Course Short Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseShortDesc"
              placeholder="Enter Description"
              {...register("courseShortDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.courseShortDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Description is required
              </span>
            )}
          </div>

          {/* Course Price */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
              Course Price <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
              <input
                id="coursePrice"
                placeholder="Enter Course Price"
                {...register("coursePrice", {
                  required: true,
                  valueAsNumber: true,
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  },
                })}
                className="form-style w-full !pl-12"
              />
              <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {errors.coursePrice && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Price is required
              </span>
            )}
          </div>

          {/* Course Category */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="courseCategory">
              Course Category <sup className='text-pink-200'>*</sup>
            </label>
            <select  
              id="courseCategory"
              defaultValue=""
              className='form-style w-full'
              {...register("courseCategory",{
                requried: true,
                setValueAs: (value) => courseCategories.find((category) => category._id === value)
              })}
              
            >
              <option value="" disabled>
                Choose a Category
              </option>
              {/* {
                console.log(courseCategories)
              } */}
              {
                !loading && 
                courseCategories?.map( ( category,index) => (
                  <option key={index} value={category?._id}>
                    {category.name}
                  </option>
                ))
              }

              
            </select>
            {errors.courseCategory && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Category is Required
              </span>
            )}
          </div>

          {/* Course Tags */}
          <ChipInput 
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
          />

          {/* Course Thumbnail Image */}
          <Upload 
            name="courseImage"
            label="Course Thumbnail"
            register= {register}
            setValue={setValue}
            errors={errors}
            editData = {editCourse ? course?.thumbnail : null}
          />

          {/* Benifits of the course */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="courseBenifits" className="text-sm text-richblack-5" >
              Benifits of the course
            </label>
            <textarea 
              id='courseBenifits'
              placeholder='Enter benifits of the course'
              {...register("courseBenifits",{requried: true})}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
              errors.courseBenifits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Benifits of the course is Required
                </span>
              )
            }
          </div>
          {/* Requirements/Instructions */}
          <RequirementsField 
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            setValue={setValue}
            errors={errors}
            getValues={getValues}
          />
          {/* Next Button */}
          <div className="flex justify-end gap-x-2">
            {editCourse && (
              <button
                onClick={ () => dispatch(setStep(2))}
                disabled={loading}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
              >
                Continue Without Saving
              </button>
            )}
            <IconBtn 
              disabled={loading}
              text={!editCourse ? "Next" : "Save Changes"}
            >
              <MdNavigateNext />
            </IconBtn>
          </div>
        </form>

    //     <form
    //   onSubmit={handleSubmit(onSubmit)}
    //   className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    // >
    //   {/* Course Title */}
    //   <div className="flex flex-col space-y-2">
    //     <label className="text-sm text-richblack-5" htmlFor="courseTitle">
    //       Course Title <sup className="text-pink-200">*</sup>
    //     </label>
    //     <input
    //       id="courseTitle"
    //       placeholder="Enter Course Title"
    //       {...register("courseTitle", { required: true })}
    //       className="form-style w-full"
    //     />
    //     {errors.courseTitle && (
    //       <span className="ml-2 text-xs tracking-wide text-pink-200">
    //         Course title is required
    //       </span>
    //     )}
    //   </div>

    //   {/* Course Short Description */}
    //   <div className="flex flex-col space-y-2">
    //     <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
    //       Course Short Description <sup className="text-pink-200">*</sup>
    //     </label>
    //     <textarea
    //       id="courseShortDesc"
    //       placeholder="Enter Description"
    //       {...register("courseShortDesc", { required: true })}
    //       className="form-style resize-x-none min-h-[130px] w-full ] "
    //     />
    //     {errors.courseShortDesc && (
    //       <span className="ml-2 text-xs tracking-wide text-pink-200">
    //         Course Description is required
    //       </span>
    //     )}
    //   </div>

    //   {/* Course Price */}
    //   <div className="flex flex-col space-y-2">
    //     <label className="text-sm text-richblack-5" htmlFor="coursePrice">
    //       Course Price <sup className="text-pink-200">*</sup>
    //     </label>
    //     <div className="relative">
    //       <input
    //         id="coursePrice"
    //         placeholder="Enter Course Price"
    //         {...register("coursePrice", {
    //           required: true,
    //           valueAsNumber: true,
    //           pattern: {
    //             value: /^(0|[1-9]\d*)(\.\d+)?$/,
    //           },
    //         })}
    //         className="form-style w-full !pl-12"

    //       />
    //       <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
    //     </div>
    //     {errors.coursePrice && (
    //       <span className="ml-2 text-xs tracking-wide text-pink-200">
    //         Course Price is required
    //       </span>
    //     )}
    //   </div>

    //   {/* Course Category */}
    //   <div className="flex flex-col space-y-2 ">
    //     <label className="text-sm text-richblack-5" htmlFor="courseCategory">
    //       Course Category <sup className="text-pink-200">*</sup>
    //     </label>
    //     <select
    //       {...register("courseCategory", { required: true })}
    //       defaultValue=""
    //       id="courseCategory"
    //       className="form-style w-full cursor-pointer"
    //     >
    //       <option value="" disabled>
    //         Choose a Category
    //       </option>
    //       {!loading &&
    //         courseCategories?.map((category, indx) => (
    //           <option key={indx} value={category?._id}>
    //             {category?.name}
    //           </option>
    //         ))}
    //     </select>
    //     {errors.courseCategory && (
    //       <span className="ml-2 text-xs tracking-wide text-pink-200">
    //         Course Category is required
    //       </span>
    //     )}
    //   </div>

    //   {/* Course Tags */}
    //   <ChipInput
    //     label="Tags"
    //     name="courseTags"
    //     placeholder="Enter Tags and press Enter or Comma"
    //     register={register}
    //     errors={errors}
    //     setValue={setValue}
    //   />

    //   {/* Course Thumbnail Image */}
    //   <Upload
    //     name="courseImage"
    //     label="Course Thumbnail"
    //     register={register}
    //     setValue={setValue}
    //     errors={errors}
    //     editData={editCourse ? course?.thumbnail : null}
    //   />

    //   {/* Benefits of the course */}
    //   <div className="flex flex-col space-y-2">
    //     <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
    //       Benefits of the course <sup className="text-pink-200">*</sup>
    //     </label>
    //     <textarea
    //       id="courseBenefits"
    //       placeholder="Enter benefits of the course"
    //       {...register("courseBenefits", { required: true })}
    //       className="form-style resize-x-none min-h-[130px] w-full"
    //     />
    //     {errors.courseBenefits && (
    //       <span className="ml-2 text-xs tracking-wide text-pink-200">
    //         Benefits of the course is required
    //       </span>
    //     )}
    //   </div>

    //   {/* Requirements/Instructions */}
    //   <RequirementsField
    //     name="courseRequirements"
    //     label="Requirements/Instructions"
    //     register={register}
    //     setValue={setValue}
    //     errors={errors}
    //   />

    //   {/* Next Button */}
    //   <div className="flex justify-end gap-x-2">
    //     {editCourse && (
    //       <button
    //         onClick={() => dispatch(setStep(2))}
    //         disabled={loading}
    //         className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
    //           text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
    //       >
    //         Continue Wihout Saving
    //       </button>
    //     )}
    //     <IconBtn
    //       disabled={loading}
    //       text={!editCourse ? "Next" : "Save Changes"}
    //     >
    //       <MdNavigateNext />
    //     </IconBtn>
    //   </div>
    // </form>
  )
}

export default CourseInformationForm