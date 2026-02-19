import express from 'express';
import { sendOTP, verifyOTP, selectRole } from '../controllers/authController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/select-role', protect, selectRole);

export default router;
