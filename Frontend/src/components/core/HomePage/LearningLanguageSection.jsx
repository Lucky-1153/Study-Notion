import React from 'react'
import HighlightText from './HighlightText'
import compare_with_others from '../../../assets/Images/Compare_with_others.png'
import know_your_progress from '../../../assets/Images/Know_your_progress.png'
import plan_your_lesson from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] items-center mb-4'>

      <div className='flex flex-col gap-5 items-center'>

        <div className='text-4xl font-semibold text-center'>
          Your Swiss Knife for
          <HighlightText text={"learning any language"} />
        </div>

        <div className='text-center text-richblue-600 mx-auto text-base font-medium w-[70%]'>
          Using spin making learning multiple languages easy, with 20+ languages realistic void-over, progress tracking, custom schedule and more.
        </div>

        <div className='ml-12 flex items-center justify-center mt-5'>
          <img 
          src={know_your_progress} 
          alt="image" 
          className='object-contain -mr-32'
          />

          <img 
          src={compare_with_others}
          alt="image" 
          className='object-contain'
          />

          <img 
          src={plan_your_lesson}
          alt="image" 
          className='object-contain -ml-36'
          />
        </div>

        <div className='w-fit '>

          <CTAButton active ={true} linkto={"/signup"}>
            <div>
              Learn more
            </div>
          </CTAButton>

        </div>

      </div>

    </div>
  )
}

export default LearningLanguageSection