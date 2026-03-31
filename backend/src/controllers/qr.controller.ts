import {  Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { fetchQrPng } from "../services/qr.service";

import { AuthRequest } from "../types";
import { createQrLink, getUserQrLinks } from "../services/qr.service";
import { sendSuccess } from "../utils/response.utils";

export const createQr = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { url, size = "300x300", color, bgcolor } = req.body as {
      url: string;
      size?: string;
      color?: string;
      bgcolor?: string;
    };

    const userId = req.user!.id;

    // 1) generate image buffer
    const buffer = await fetchQrPng(url, { size, color, bgcolor });

    // 2) save metadata in DB
    const record = await createQrLink({
      userId,
      url,
      size,
      color,
      bgcolor,
    });

    // 3) send both DB info + PNG
    return res
      .status(201)
      .set("Content-Type", "image/png")
      .set("X-Qr-Id", record._id.toString())
      .send(buffer);
  } catch (err) {
    return next(err);
  }
};

export const listUserQr = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const items = await getUserQrLinks(userId);
    return sendSuccess(res, items, "QR links fetched");
  } catch (err) {
    return next(err);
  }
};