import {combineReducers} from '@reduxjs/toolkit'
import authReducer from '../slices/auth.slice'
import profileReducer from '../slices/profile.slice'
import cartReducer from '../slices/cart.slice'
import courseReducer from '../slices/course.slice'
import viewCourseReducer from '../slices/viewCourse.slice'

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
    viewCourse: viewCourseReducer,
})

export default rootReducer