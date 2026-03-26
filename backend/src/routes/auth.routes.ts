import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
// import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;