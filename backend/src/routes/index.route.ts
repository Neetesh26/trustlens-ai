import { Router } from 'express';
import authRoutes from './auth.routes';
import scanRoutes from './scan.routes';
import qrRoutes from './qr.routes'
const router = Router();

router.use('/auth', authRoutes);
router.use('/scan', scanRoutes);
router.use("/qr", qrRoutes); 

export default router;