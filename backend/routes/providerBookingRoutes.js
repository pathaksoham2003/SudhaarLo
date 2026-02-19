import express from 'express';
import { getProviderBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('SERVICE_PROVIDER'), getProviderBookings);

export default router;
