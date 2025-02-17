import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { getBookingDetails, getSeatAvailability, reserveSeat } from "../controllers/user.controller.js"
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/register', register);

router.get('/availability', getSeatAvailability);
router.post('/bookTickets', authMiddleware, reserveSeat);
router.get('/getBookingDetails', authMiddleware, getBookingDetails);

export default router;