import { Response } from "express";
import { scanWebsite } from "../services/scan.service";
import { calculateTrustScore } from "../services/score.service";
import { generateAIRiskReport } from "../services/ai.service";
import { ScanReport } from "../models/ScanReport.model";



export const analyzeSite = async (req: any, res: Response) => {
  try {
    // console.log("REQ USER:", req.user);

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const normalizedUrl = url.startsWith("http")
      ? url
      : `https://${url}`;

     const rawData = await scanWebsite(normalizedUrl);

    const score = calculateTrustScore(rawData);

    const aiSummary = await generateAIRiskReport(rawData, score);


    const report = await ScanReport.create({
      userId: req.user?.id || "65f1c2abc123456789abcd12", 
      url: normalizedUrl,
      trustScore: score.trustScore,
      riskLevel: score.riskLevel,
      breakdown: score.breakdown,
      aiSummary,
      detectedThreats: score.detectedThreats,
      rawData,
    });

    return res.status(201).json({
      success: true,
      data: { report },
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Scan failed",
    });
  }
};


// 📊 GET HISTORY
export const getScanHistory = async (req: any, res: Response) => {
  try {
    const reports = await ScanReport.find({
      userId: req.user?.id || "65f1c2abc123456789abcd12",
    })
      .sort({ createdAt: -1 })
      .select("-rawData");

    res.json({
      success: true,
      data: reports,
    });

  } catch (error: any) {
    console.error("❌ HISTORY ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};