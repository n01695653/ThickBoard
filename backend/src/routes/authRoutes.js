import express from 'express';
import {  register,  login, verifyOTP, getProfile } from '../controllers/authControllers.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes 
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);

// Protected route (requires token)
router.get('/profile', verifyToken, getProfile);

export default router;