// import rateLimit from "express-rate-limit";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// export const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });


// import rateLimit from 'express-rate-limit';
// import { env } from '../config/env';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs:15*60*1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Strict limiter for auth routes (brute-force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Wait 15 minutes.' },
});

// Scan limiter (per user)

// Scan limiter (per user or IP fallback)
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,

  keyGenerator: (req) => {
    // ✅ If logged in → use user ID
    if ((req as any).user?.id) {
      return `user-${(req as any).user.id}`;
    }

    return ipKeyGenerator(req.ip || "");
  },

  message: {
    success: false,
    message: "Scan rate limit reached. Max 5 scans/minute.",
  },
});