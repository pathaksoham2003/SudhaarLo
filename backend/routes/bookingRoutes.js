import express from 'express';
import {
    createBooking,
    getMyBookings,
    getProviderBookings,
    getAllBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, authorize } from '../utils/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/', authorize('CUSTOMER'), createBooking);
router.get('/my', authorize('CUSTOMER'), getMyBookings);

// Provider routes
router.get('/provider', authorize('SERVICE_PROVIDER'), getProviderBookings);
router.put('/:id/status', authorize('SERVICE_PROVIDER'), updateBookingStatus);

// Admin routes
router.get('/', authorize('ADMIN'), getAllBookings);

export default router;
