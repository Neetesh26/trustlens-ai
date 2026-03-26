import { Router } from 'express';
import authRoutes from './auth.routes';
import scanRoutes from './scan.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/scan', scanRoutes);

export default router;