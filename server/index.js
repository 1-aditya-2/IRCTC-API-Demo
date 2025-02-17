import express from 'express';
import { configDotenv } from 'dotenv';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';

configDotenv();

const app = express();
app.use(express.json());


// routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});