import express from 'express';
// import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors'
import moment from 'moment-timezone';
import dotenv from 'dotenv';

// // NOTE: files were created
import router from './routes/index.js';
import connectDB from './config/db.js';
import errorHandler from './utils/errorHandler.js';

moment.tz.setDefault('Asia/Manila')

// Load Environment Variables
dotenv.config({ path: './config/config.env'});

connectDB();

// PORT
const PORT = process.env?.PORT || 5050;

// Server
const app = express();

app.use(cors());
app.use(express.json());

// Morgan HTTP request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Sample Route
app.get("/", (req, res, next) => {
    res.status(200).json({
        c: 200,
        m: "Hello World!",
        d: {}
    });
});

app.get("/api/v1/test", (req, res, next) => {
    let num = 0x1aaa

    console.log(num)
    
    res.status(200).json({
        c: 200,
        m: "Hello World!",
        d: {}
    });
});

app.use('/api/v1', router)
app.use(errorHandler); // handle request error

app.listen(
    PORT,
    console.log(`Server running in ${[process.env.NOTE_ENV]} mode with port ${PORT}`.yellow.bold));
  
  process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`.red.bold);
  // server.close(() => process.exit(1));
  });

export default app;