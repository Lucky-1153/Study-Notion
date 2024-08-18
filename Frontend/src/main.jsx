import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import rootReducer from './reducer/index.jsx'
import {Toaster} from 'react-hot-toast'
import { configureStore } from '@reduxjs/toolkit'
import "./App.css"

const store = configureStore({
    reducer: rootReducer,
})

// window.global = window;

ReactDOM.createRoot(document.getElementById('root')).render(
  

    
        <Provider store = {store}>
            <BrowserRouter>
            
                <App />
                <Toaster />
            </BrowserRouter>
        </Provider>
    
        
   
)
