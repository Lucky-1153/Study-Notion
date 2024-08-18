import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'


let app = express()

app.use(express.json())
// app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())


app.use( cors({
    origin: "https://study-notion-client-k6hmvrtn9-lucky-1153s-projects.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)


//===============Import Routes=========================
import userRoutes from "./routes/User.route.js"
import profileRoutes from './routes/Profile.route.js'
import paymentRoutes from './routes/Payments.route.js'
import courseRoutes from './routes/Course.route.js'


//=============Mount Routes=============================
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/course', courseRoutes)


//============Default Route================================
app.get('/', (req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', 'https://study-notion-client-k6hmvrtn9-lucky-1153s-projects.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
     res.send('<div> this is default route <p> everything is okay </p> </div>')
    next();
   
})


export {app}
