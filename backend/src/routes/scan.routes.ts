import { Router } from 'express';
import {analyzeSite}  from '../controllers/scan.controller';
import { protect } from '../middlewares/auth.middleware';
import { scanLimiter } from '../middlewares/rateLimiter.middleware';
import { scanValidator } from '../validators/scan.validator';

const router = Router();

router.post('/analyze',protect, scanLimiter, scanValidator, analyzeSite);

export default router;