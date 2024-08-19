
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

//
let app = express()

const corsOptions = {

    origin: "https://study-notion-frontend-2ib6.onrender.com", 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
    credentials: true,
    optionsSuccessStatus: 200,
}
// Use CORS with the defined options
app.use(cors(corsOptions, (req, res, next) => {
  console.log('CORS middleware executed');
  next();
}));

app.use(express.json())
// app.use(express.urlencoded())

app.use(cookieParser())


app.use(express.static("public"))
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp'
    })
)

app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Response headers:', res.headers);
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error');
});

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
    res.header('Access-Control-Allow-Origin', 'https://study-notion-frontend-2ib6.onrender.com');
    res.send('<div> this is default route <p> everything is okay </p> </div>') 
    console.log('Response headers:',res.getHeaders());
})


export {app}
