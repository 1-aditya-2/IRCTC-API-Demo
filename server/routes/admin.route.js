import express from 'express';
import { addTrain, updateTrainSeats } from '../controllers/admin.controller.js';
import { adminAuthMiddleware, verifyApiKey } from '../middlewares/auth.middleware.js';
import { registerAdmin, loginAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication Routes
router.post('/register', verifyApiKey, registerAdmin);
router.post('/login', verifyApiKey, loginAdmin);

router.put('/update-seats/:trainId', verifyApiKey, adminAuthMiddleware, updateTrainSeats);
router.post('/addTrain', verifyApiKey, adminAuthMiddleware, addTrain);

export default router;