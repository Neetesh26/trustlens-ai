import { Router } from 'express';
import {analyzeSite}  from '../controllers/scan.controller';
// import { protect } from '../middlewares/';
import { scanLimiter } from '../middlewares/rateLimiter.middleware';
import { scanValidator } from '../validators/scan.validator';

const router = Router();

router.post('/analyze', scanLimiter, scanValidator, analyzeSite);

export default router;