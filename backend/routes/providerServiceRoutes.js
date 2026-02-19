import express from 'express';
import {
    createProviderService,
    getProviderServices,
    updateProviderServiceStatus,
    updateProviderService,
    deleteProviderService
} from '../controllers/providerServiceController.js';
import { protect, authorize } from '../utils/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('SERVICE_PROVIDER'));

router.post('/', createProviderService);
router.get('/', getProviderServices);
router.patch('/:id/status', updateProviderServiceStatus);
router.put('/:id', updateProviderService);
router.delete('/:id', deleteProviderService);

export default router;
