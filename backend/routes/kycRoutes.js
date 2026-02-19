import express from 'express';
import { submitKYCDetails, uploadKYCDocuments, getKYCStatus } from '../controllers/kycController.js';
import { protect, authorize } from '../utils/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

// All KYC routes require authentication and SERVICE_PROVIDER role
router.use(protect);
router.use(authorize('SERVICE_PROVIDER'));

router.post('/submit', submitKYCDetails);

router.post('/upload-documents', upload.fields([
    { name: 'aadhar_file', maxCount: 1 },
    { name: 'pan_file', maxCount: 1 }
]), uploadKYCDocuments);

router.get('/status', getKYCStatus);

export default router;
