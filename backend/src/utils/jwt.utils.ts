import jwt from 'jsonwebtoken';
import {  getEnv } from '../config/env';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getEnv("JWT_SECRET") , {
    expiresIn: "7d",
  } as jwt.SignOptions);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, "jnadjckj", {
    expiresIn: '30d',
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, getEnv("JWT_SECRET")) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, "jnadjckj") as JwtPayload;
};