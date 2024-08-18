import React, { useEffect, useState } from 'react'
import {FaArrowRight} from 'react-icons/fa'
import {Link, useNavigate} from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton'
import ReviewSlider from '../components/Common/ReviewSlider'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimeLineSection'
import  LearningLanguageSection  from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import Footer from '../components/Common/Footer'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import {getCatalogPageData} from '../services/operations/PageAndComponentApi'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineRateReview } from 'react-icons/md'


const Home = () => {

    const [CatalogPageData, setCatalogPageData] = useState(null);
    const categoryID = "668b8366b0a6e6fd72e9b23a"
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCatalogPageData = async () => {

            const result = await getCatalogPageData(categoryID, dispatch);
            setCatalogPageData(result?.data);
            console.log("result is ",result)
            console.log("catalog dat is",CatalogPageData)
            // console.log("page data ==== ",CatalogPageData);
        }
        if (categoryID) {
            fetchCatalogPageData();
        }
    }, [categoryID])

    const {user} = useSelector( (state) => state.profile)

    const handleBecomeInstructor = () => {
      if(user?.accountType === "Student"){
        navigate(`/signup/Instructor`)
      }
      else if(user?.accountType === "Instructor"){
        navigate(`/dashboard/instructor`)
      }
      else{
        navigate(`/signup`)
      }
    }

  return (
    // <div>

        

    //     {/* Section -> 1 */}
    //     <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
            
    //         <Link to={"/signup"}>
    //             <div className='group mt-16 p-1 mx-auto mx-atuo rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit '>
    //                 <div className='flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
    //                     <p>Become an Instructor</p>
    //                     <FaArrowRight />
    //                 </div>
    //             </div>
    //         </Link>

    //         <div className='flex text-center text-4xl font-semibold mt-4'>
    //             Empower Your Future with
    //             <HighlightText  text ={" Coding Skills"} />
    //         </div>

    //         <div className='max-w-[858px] mt-4 w-[90%] text center text-lg font bold text-richblack-300'>
    //             With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes and personalize feedback from instructors
    //         </div>

    //         <div className='flex gap-7 mt-8'>
    //             <CTAButton active={true} linkto={"/signup"} >
    //                 Learn more
    //             </CTAButton>

    //             <CTAButton active={false} linkto={'/login'}>
    //                 Book a Demo
    //             </CTAButton>
    //         </div>

    //         <div className='shadow-blue-200 mx-3 my-12 max-w-[858px]'>
    //             <video
    //             muted
    //             loop
    //             autoPlay
    //             >
    //             <source src={Banner} type='video/mp4'/>
    //             </video>
    //         </div>

    //         {/* Code Section 1 */}
    //         <div className='max-w-[858px] '>
    //             <CodeBlocks
    //                 position={"lg:flex-row"}
    //                 heading={
    //                     <div className=' text-4xl font-semibold'>
    //                         <span> 
    //                             Unlock Your<HighlightText text={"coding potential"} />
    //                             with our online courses    
    //                         </span> 
                            
    //                     </ div>
    //                 }
    //                 subHeading={"Our courses are designed and taught by industry expoerts who have years fo experience"}
    //                 ctabtn1={{
    //                     btnText:"try it yourself",
    //                     linkto: "/signup",
    //                     active: true,
    //                 }}
    //                 ctabtn2={{
    //                     btnText:"learn more",
    //                     linkto: "/login",
    //                     active: false,
    //                 }}

    //                 codeblock={`<<!DOCTYPE <html>\n<html>\n<head><title>Example</title?<linkre="stylesheet"href="styles.css">\n`}
    //                 codeColor={"text-yellow-25"}
    //             />
    //         </div>

    //         {/* Code Section 2 */}
    //         <div className='max-w-[858px] '>
    //             <CodeBlocks
    //                 position={"lg:flex-row-reverse"}
    //                 heading={
    //                     <div className=' text-4xl font-semibold'>
    //                         <span> 
    //                             Unlock Your<HighlightText text={"coding potential"} />
    //                             with our online courses    
    //                         </span> 
                            
    //                     </ div>
    //                 }
    //                 subHeading={"Our courses are designed and taught by industry expoerts who have years fo experience"}
    //                 ctabtn1={{
    //                     btnText:"try it yourself",
    //                     linkto: "/signup",
    //                     active: true,
    //                 }}
    //                 ctabtn2={{
    //                     btnText:"learn more",
    //                     linkto: "/login",
    //                     active: false,
    //                 }}

    //                 codeblock={`<<!DOCTYPE <html>\n<html>\n<head><title>Example</title?<linkre="stylesheet"href="styles.css">\n`}
    //                 codeColor={"text-yellow-25"}
    //             />
    //         </div>
    //         <ExploreMore />

    //     </div>


    //     {/* Section -> 2 */}
    //     <div className='bg-pure-greys-5 text-richblack-700'>

    //         <div className='homepage_bg h-[310px]'>

    //                 <div className='w-11/12 max-w-maxContent flex items-center gap-5 mx-auto justify-center'>

    //                 <div className='h-[250px]'></div>
    //                     <div className='flex flex-row gap-7 text-white'>
    //                         <CTAButton active={true} linkto={"/signup"}>
    //                             <div className='flex items-center gap-3'>
    //                                 Explore Full Catalog
    //                                 <FaArrowRight/>
    //                             </div>
    //                         </CTAButton>

    //                         <CTAButton active={false} linkto={"/signup"}>
    //                             Learn more
    //                         </CTAButton>
    //                     </div>
    //                 </div>
    //         </div>

    //         <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-betwen gap-7'>

    //             <div className='flex  mb-10 mt-[110px]'>

    //                 <div className='text-4xl font-semibold w-[45%] ml-32'>
    //                     Get the Skills you need for a 
    //                     <HighlightText text={"Job that is in demand"} />
    //                 </div>

    //                 <div className=' flex-col gap-10 w-[40%] items-start'>
    //                     <div className='text-[16px] mb-[25px]'>
    //                         The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
    //                     </div>
    //                     <div className='max-w-[150px]'> 
    //                         <CTAButton active={true} linkto={"/signup"}>
    //                             <div className='font-bold'>
    //                                 Learn more
    //                             </div>
    //                         </CTAButton>
    //                     </div>
                        

    //                 </div>
    //             </div>

    //             <TimeLineSection />
                
    //             <LearningLanguageSection />
    //         </div>

    //     </div>

    //     {/* Section -> 3 */}
    //     <div className=' w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
        
    //         <InstructorSection />

    //     </div>

    //     {/* Footer */} 
    //     <Footer />
    // </div>

    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a Instructor Button */}

        {/* {
        <Link to={{
          pathname: user?.accountType === "Student" ? "/signup" : "/dashboard/instructor",
          search: "tab=instructor"
        }}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
      } */}

      <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
          <button 
            onClick={handleBecomeInstructor}
            className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
            <p>Become an Instructor</p>
            <FaArrowRight />
          </button>
      </div>

      
        

        {/* Heading */}
        <div className="text-center text-4xl font-semibold">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1  */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        <div className=''>
            <CodeBlocks
                position={"lg:flex-row"}
                heading={
                <div className="text-3xl lg:text-4xl font-semibold">
                    Unlock your
                    <HighlightText text={"coding potential"} /> with our online
                    courses.
                </div>
                }
                subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={{
                btnText: "Try it Yourself",
                link: "/signup",
                active: true,
                }}
                ctabtn2={{
                btnText: "Learn More",
                link: "/signup",
                active: false,
                }}
                codeColor={"text-yellow-25"}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                backgroundGradient={"code-block1-grad"}
            />
        </div>
          
        </div>

        {/* Code Section 2 */}
        <div>
            <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                    <div className="w-[100%] text-3xl lg:text-4xl font-semibold lg:w-[50%]">
                        Start
                        <HighlightText text={"coding in seconds"} />
                    </div>
                }
                subheading={
                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={{
                    btnText: "Continue Lesson",
                    link: "/signup",
                    active: true,
                }}
                ctabtn2={{
                    btnText: "Learn More",
                    link: "/signup",
                    active: false,
                }}
                codeColor={"text-white"}
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                backgroundGradient={"code-block2-grad"}
            />
        </div>

        {/* Course Slider */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
            <h2 className='text-white mb-6 text-2xl '>
                Popular Picks for You 🏆
            </h2>
            <CourseSlider Courses={CatalogPageData?.selectedCategory?.courses} />
        </div>
        <div className=' mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent'>
            <h2 className='text-white mb-6 text-2xl '>
                Top Enrollments Today 🔥
            </h2>
            <CourseSlider Courses={CatalogPageData?.mostSellingCourses} />
        </div>

        {/* Explore Section */}
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          {/* Explore Full Catagory Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-7 ">
          {/* Job that is in Demand - Section 1 */}
          <div className="flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]">
            <div className="text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]">
              Get the skills you need for a
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className='mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
        <InstructorSection />
              <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
                Reviews from other learners <MdOutlineRateReview className='text-yellow-25' />
              </h1>
              <div >
              <ReviewSlider className="w-full"/>
              </div>
              
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home