import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { categories } from '../services/apis'
import Footer from '../components/Common/Footer'
import { apiConnector } from '../services/apiConnector'
import {getCatalogPageData} from '../services/operations/PageAndComponentApi'
import CourseCard from '../components/core/Catalog/CourseCard'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import Error from './Error'


const Catalog = () => {

    const {loading} = useSelector( (state) => state.profile)
    const {catalogName} = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [catagoryId, setCatagoryId] = useState("")
    
    useEffect( () => {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API)
            console.log("res is : ",res)
            const category_id = res?.data?.getAllCategory?.filter( (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
            setCatagoryId(category_id)
            console.log('here its working',category_id)
        }
        getCategories()
    },[catalogName])

    useEffect(  () => {
        const getCatgoryDetails = async() => {
            try {
                const res = await getCatalogPageData(catagoryId)
                console.log("Printing res: ", res)
                setCatalogPageData(res)
            } catch (error) {
                    console.log(error)
            }
        }
        if(catagoryId)
            getCatgoryDetails()
    },[catagoryId])

    // if(loading || !catalogPageData){
    //     return(
    //         <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
    //             <div className='spinner'></div>
    //         </div>
    //     )
    // }
    if(!loading && !catalogPageData)
        return <Error />

  return (
    <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
            {console.log("selected category : ",catalogPageData?.data?.selectedCategory?.courses)}
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.differentCategory?.name}
                
            </div>
            <div className="py-8">
            {console.log("different category : ",catalogPageData?.data?.differentCategory?.courses)}
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <CourseCard course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
  )
}

export default Catalog