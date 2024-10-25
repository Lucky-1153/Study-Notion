
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

//
let app = express()

// const corsOptions = {

//     origin: "https://study-notion-frontend-2ib6.onrender.com", 
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allow these methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
//     credentials: true,
//     optionsSuccessStatus: 200,
// }
// Use CORS with the defined options
app.use(cors());

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
    // res.header('Access-Control-Allow-Origin', 'https://study-notion-frontend-2ib6.onrender.com');
    res.send('<div> this is default route <p> everything is okay </p> </div>') 
    console.log('Response headers:',res.getHeaders());
})


export {app}

// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import fileUpload from 'express-fileupload';
// import helmet from 'helmet';

// // Initialize Express app
// const app = express();

// // Apply security middleware using Helmet
// app.use(
//     helmet({
//         contentSecurityPolicy: {
//             directives: {
//                 "default-src": ["'self'"],
//                 "script-src": ["'self'", "'unsafe-inline'", "chrome-extension://*"],
//             },
//         },
//     })
// );

// // Middleware setup
// app.use(express.json());
// app.use(express.static("public"));
// app.use(cookieParser());

// // CORS configuration
// app.use(
//     cors({
//         origin: "*", // Adjust this for production (e.g., specific domain)
//         credentials: true,
//     })
// );

// // File upload configuration
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: '/tmp',
//     })
// );

// // Import Routes
// import userRoutes from "./routes/User.route.js";
// import profileRoutes from './routes/Profile.route.js';
// import paymentRoutes from './routes/Payments.route.js';
// import courseRoutes from './routes/Course.route.js';

// // Mount Routes
// app.use('/api/v1/auth', userRoutes);
// app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/payment', paymentRoutes);
// app.use('/api/v1/course', courseRoutes);

// // Default Route
// app.get('/', (req, res) => {
//     res.send('<div>This is the default route <p>Everything is okay</p></div>');
// });

// export { app };
