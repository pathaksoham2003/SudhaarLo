import express from 'express';
import { searchProviders, getProviderDetails } from '../controllers/providerController.js';
import { getProviderReviews, getServiceReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/search', searchProviders);
router.get('/:id', getProviderDetails);
router.get('/:id/reviews', getProviderReviews);
router.get('/:provider_id/services/:service_id/reviews', getServiceReviews);

export default router;
