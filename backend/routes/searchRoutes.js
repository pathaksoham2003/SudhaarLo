import express from 'express';
import { searchProviders } from '../controllers/providerController.js';

const router = express.Router();

router.get('/providers', searchProviders);

export default router;
