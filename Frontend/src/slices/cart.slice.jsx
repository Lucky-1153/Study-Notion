import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"

const initialState = {
    cart: localStorage.getItem("cart") 
        ? JSON.parse(localStorage.getItem("cart")) 
        : [],
    
    total: localStorage.getItem("total")
        ? JSON.parse(localStorage.getItem("total"))
        : 0,
    
    totalItems : localStorage.getItem('totalItems')
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0,
    
}

const cartSlice = createSlice(
    {
        name: "cart",
        initialState: initialState,
        reducers:{

            addToCart : ( state, action) => {
                const course = action.payload
                const index = state.cart.findIndex( (item) => item._id === course._id)

                if(index > 0){
                    //if the course is already present show toast
                    toast.error("Course already added to cart")
                    return
                }

                //if course is not in the cart add to the cart
                state.cart.push(course)
                //update the total quanity and price
                state.totalItems++
                state.total += course.price

                //update to localStorage
                localStorage.setItem("cart", JSON.stringify(state.cart))
                localStorage.setItem("total", JSON.stringify(state.total))
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
                //show toast
                toast.success("Course added to cart")
            },

            removeFromCart: (state, action) => {
                if(!action.payload)
                    throw new Error("actiion payload is undefined")
                const courseId = action.payload
                const index = state.cart.findIndex((item) => item._id === courseId)

                if(index >= 0){
                    //if the course is found in the cart remove it
                    state.totalItems--
                    state.total -= state.cart[index].price
                    state.cart.splice(index, 1)
                    //update to local Storage
                    localStorage.setItem("cart", JSON.stringify(state.cart))
                    localStorage.setItem("total", JSON.stringify(state.total))
                    localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
                    //show toast
                    toast.success("Course removed from cart")
                }
            },  

            resetCart: (state) => {
                state.cart = []
                state.total = 0
                state.totalItems = 0
                //update localStorage
                localStorage.removeItem("cart")
                localStorage.removeItem("total")
                localStorage.removeItem("totalItems")
            }
        }
    }
)

export const { addToCart, removeFromCart, resetCart} = cartSlice.actions
export default cartSlice.reducer