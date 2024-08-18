import React from 'react'
import Instructor from '../../../assets/Images/teacher3.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div >
        <div className='flex flex-col-reverse lg:flex-row gap-10 lg:gap-20 items-center'> 

          <div>
            <img 
            src={Instructor}
            alt="instructor image" 
            className='shadow-white rounded-3xl '
            />
          </div>

          <div className='lg:w-[50%] flex flex-col'>

            <div className='text-3xl lg:text-4xl font-semobold w-[50%] mb-2'>
              Become an
              <HighlightText text={"Instructor"} />
            </div>

            <p className='font-medium text-[16px] w-[80%] text-richblack-300 mb-12'>
              Instructors from around the world teach millions of students an StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
              <CTAButton active={true} linkto={"/singup"}>
                <div className='flex flex-row gap-2 items-center'>
                  Start Learning Today
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>

        </div>
    </div>
  )
}

export default InstructorSection