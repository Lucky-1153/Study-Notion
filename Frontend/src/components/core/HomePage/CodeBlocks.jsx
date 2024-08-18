import React from 'react'
import CTAButton from './CTAButton' 
import {FaArrowRight} from 'react-icons/fa'
import {TypeAnimation} from 'react-type-animation'

const CodeBlocks = ( {position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}) => {
  return (
    // <div className={`relative flex w-[858px] ml-25 ${position} my-20 justify-between gap-14 `}>
    //     {/* Section 1 */}
    //     <div className='w-[480px] flex flex-col gap-8  max-h-[300px]'>
    //         {heading}
    //         <div className='text-richblack-300 font-bold'>
    //             {subHeading}
    //         </div>

    //         <div className='flex gap-7 mt-7'>
    //             <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
    //                 <div className='flex gap-2 items-center font-bold'>
    //                     {ctabtn1.btnText}
    //                     <FaArrowRight/>
    //                 </div>
    //             </CTAButton>

    //             <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
    //                 <div className='flex gap-2 items-center font-bold'>
    //                     {ctabtn2.btnText}
    //                 </div>
    //             </CTAButton>
    //         </div>

    //     </div>

    //     {/* Section -> 2 */}
    //     <div className='items-center flex flex-row text-[10px]  py-4 lg:w-[370px] '>
    //         <div className='tex-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
    //             <p>1</p>
    //             <p>2</p>
    //             <p>3</p>
    //             <p>4</p>
    //             <p>5</p>
    //             <p>6</p>
    //             <p>7</p>
    //             <p>8</p>
    //             <p>9</p>
    //             <p>10</p>
    //         </div>

    //         <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
    //             <TypeAnimation
    //                 sequence = {[codeblock, 2000,""]}
    //                 repeat={Infinity}
    //                 curosr={true}
    //                 omitDeletionAnimation= {true}
    //                 style={
    //                     { 
    //                         display: "block",
    //                         whiteSpace: "pre-line"
    //                     }
    //                 }
    //             />
    //         </div>

    //     </div>
    // </div>

    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>


            {/* Section 1  */}
            <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
                {heading}

                {/* Sub Heading */}
                <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
                    {subheading}
                </div>

                {/* Button Group */}
                <div className="flex gap-7 mt-7">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
                        <div className="flex items-center gap-2">
                            {ctabtn1.btnText}
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>

            {/* Section 2 */}
            <div className="h-fit code-border border border-richblack-700 rounded-xl flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">

                {/* Indexing */}
                <div className="text-center flex flex-col  w-[10%] select-none text-richblack-400 font-inter font-bold ">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

                {/* Codes */}
                <div
                    className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
                >
                     <div className={`${backgroundGradient}`}></div>

                    {/* <TypeAnimation
                        sequence={[codeblock, 1000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block",
                        }}
                        omitDeletionAnimation={true}
                    /> */}
                     <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
           
            style = {
                {
                    whiteSpace: "pre-line",
                    display:"block",
                    overflowX:"hidden",
                    fontSize:"16px",
                }
            }
            omitDeletionAnimation={true}
           />
                </div>
            </div>
        </div>
  )
}

export default CodeBlocks