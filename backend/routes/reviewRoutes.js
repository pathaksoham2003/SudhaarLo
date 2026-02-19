import express from 'express';
import { addReview, getProviderReviews, getServiceReviews } from '../controllers/reviewController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/provider/:id', getProviderReviews);
router.get('/provider/:provider_id/service/:service_id', getServiceReviews);

export default router;
