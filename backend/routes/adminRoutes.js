import express from 'express';
import {
    getUsers,
    createCategory,
    createService,
    getCategories,
    getServices,
    getExpiredSubscriptions,
    getDashboardStats,
    getSystemSetting,
    updateSystemSetting
} from '../controllers/adminController.js';
import { protect, authorize } from '../utils/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getUsers);
router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.post('/services', createService);
router.get('/services', getServices);
router.get('/subscriptions/expired', getExpiredSubscriptions);
router.get('/dashboard', getDashboardStats);
router.get('/settings/:key', getSystemSetting);
router.put('/settings/:key', updateSystemSetting);

export default router;
