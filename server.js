import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';

// config
dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth', authRoute);

// test route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Ecommerce App</h1>");
});

// port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});