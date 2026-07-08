import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productRoutes.js';
import subcategoryRoute from './routes/subcategoryRoutes.js';
import sectionRoute from './routes/sectionRoutes.js';
import orderRoute from './routes/orderRoute.js';

dotenv.config();
connectDB();

const app = express();

console.log("Setting up CORS middleware...");

// ✅ Simple CORS with wildcard for debugging
app.use(cors());
console.log("CORS middleware applied");

app.use(express.json());
app.use(morgan('dev'));

console.log("All middleware setup complete");

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/subcategory', subcategoryRoute);
app.use('/api/v1/section', sectionRoute);
app.use('/api/v1/order', orderRoute);

app.get('/', (req, res) => {
    res.send("API WORKING");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});