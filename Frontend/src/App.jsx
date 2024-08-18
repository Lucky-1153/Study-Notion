import React from "react";

import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Navbar from "./components/Common/Navbar.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Settings from './components/core/Dashboard/Settings/index.jsx'
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx";
import { ACCOUNT_TYPE } from "./utils/Constants.jsx";
import AddCourse from './components/core/Dashboard/AddCourse'
import { useSelector } from "react-redux";
import MyCourse from "./components/core/Dashboard/MyCourse.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import VideoDetails from "./components/core/ViewCourse/VideoDetails.jsx";
import Cart from "./components/core/Dashboard/Cart/index.jsx";
import EditCourse from './components/core/Dashboard/EditCourse'
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor.jsx";
import Contact from "./pages/Contact.jsx";

function App () {

    const {user} = useSelector((state) => state.profile)
    return(
        <div className="w-screen min-h-screen bg-richblack-900 flex-col ">

            <Navbar />

            <Routes>

                <Route path="/" element = {<Home/>} />
                <Route path="login" element = {<Login />} />
                <Route path="/signup/:tab?" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/updatePassword/:id" element={<UpdatePassword />} />
                <Route path="/verifyEmail" element={<VerifyEmail />} />
                <Route path="/about" element = {<About />} />
                <Route path="/dashboard" element={<Dashboard />} /> 

                <Route path="catalog/:catalogName" element = {<Catalog />} />
                <Route path="courses/:courseId" element ={<CourseDetails/>} />
                <Route path="/contact" element={<Contact />} />

                <Route
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path="/dashboard/my-profile" element={ <MyProfile />}/>
                    <Route path="/dashboard/settings" element={<Settings />} />

                    {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <>
                            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
                            <Route path="/dashboard/cart" element={<Cart />} />
                        </>
                    )}
                    


                    {
                        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                            <>
                                <Route path="dashboard/add-course" element={<AddCourse />} />
                                <Route path="dashboard/my-courses" element={<MyCourse />} />
                                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                                <Route path="dashboard/instructor" element={<Instructor />} />
                                
                                
                            </>
                        )
                    }
                </Route>

                <Route
                    element={<ViewCourse/>}
                >
                    {
                        user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                                <Route 
                                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                                    element={<VideoDetails />}
                                />
                            </>
                        )
                    }
                </Route>

            </Routes>            
        </div>
    )
}

export default App