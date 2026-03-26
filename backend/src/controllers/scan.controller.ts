import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

import { AuthRequest } from "../types";
import { scanWebsite } from "../services/scan.service";
import { calculateTrustScore } from "../services/score.service";
import { generateAIRiskReport } from "../services/ai.service";

import { ScanReport } from "../models/ScanReport.model";
import { User } from "../models/user.model";

import { sendSuccess, sendError } from "../utils/response.utils";
import NotFoundHandler from "../errors/NotFoundHandler";
import UnauthorizedException from "../errors/unAuthorizedException";

export const analyzeSite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ 1. Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, "Validation failed", 422, errors.array());
      return;
    }

    const { url } = req.body as { url: string };

    // ✅ 2. Safe user extraction
    if (!req.user) {
      throw new UnauthorizedException("User not authenticated", 401);
    }

    const userId = req.user.id;

    // ✅ 3. Normalize URL
    const normalizedUrl = url.startsWith("http")
      ? url
      : `https://${url}`;

    // ✅ 4. Fetch user
    const user = await User.findById(userId).session(session);
    if (!user) throw new NotFoundHandler("User not found", 404);

    // ✅ 5. Check limits
    if (user.role === "free" && user.scanCount >= user.scanLimit) {
      throw new UnauthorizedException(
        "Daily scan limit reached. Upgrade to Pro.",
        429
      );
    }

    // ✅ 6. Scan website
    const rawData = await scanWebsite(normalizedUrl);

    // ✅ 7. Score calculation
    const scoreResult = calculateTrustScore(rawData);

    // ✅ 8. AI analysis
    const aiSummary = await generateAIRiskReport(
      rawData,
      scoreResult
    );

    // ✅ 9. Save report
    const report = await ScanReport.create(
  [
    {
      userId,
      url: normalizedUrl,
      trustScore: scoreResult.trustScore,
      riskLevel: scoreResult.riskLevel,
      breakdown: scoreResult.breakdown,
      aiSummary,
      detectedThreats: scoreResult.detectedThreats,
      rawData
    },
  ],
  { session }
);
    // ✅ 10. Update user scan count
    await User.updateOne(
      { _id: userId },
      { $inc: { scanCount: 1 } },
      { session }
    );

    // ✅ 11. Commit transaction
    await session.commitTransaction();
    session.endSession();

    sendSuccess(
      res,
      { report: report[0] },
      "Scan completed successfully",
      201
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};