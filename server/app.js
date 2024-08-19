
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

//
let app = express()

app.use(express.json())
// app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

const corsOptions = {

    origin: "*", 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
    credentials: true,
    optionsSuccessStatus: 200,
}
// Use CORS with the defined options
app.use(cors(corsOptions));

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
app.use('/auth', userRoutes)
app.use('/profile', profileRoutes)
app.use('/payment', paymentRoutes)
app.use('/course', courseRoutes)


//============Default Route================================
app.get('/', (req, res) => {
    res.send('<div> this is default route <p> everything is okay </p> </div>') 
})


export {app}
