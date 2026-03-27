import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(">>>>>>>>",errors);
      
      sendError(res, 'Validation failed', 422, errors.array());
      return;
    }

    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const { user, accessToken, refreshToken } = await registerUser({ name, email, password });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendSuccess(res, { user, accessToken }, 'Registration successful', 201);
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', 422, errors.array());
      return;
    }

    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { user, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { User } = await import('../models/user.model');
    const user = await User.findById((req as { user?: { id: string } }).user?.id);
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
};