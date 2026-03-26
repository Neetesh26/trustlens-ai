import mongoose, { Document, Schema } from 'mongoose';


export interface IScanReport extends Document {
  userId: mongoose.Types.ObjectId;
  url: string;
  trustScore: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  breakdown: {
    ssl: number;
    scripts: number;
    forms: number;
    cookies: number;
    phishing: number;
  };
  aiSummary: string;
  detectedThreats: string[];
  rawData: any,
  createdAt: Date;
}

const ScanReportSchema = new Schema<IScanReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    trustScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ['safe', 'suspicious', 'dangerous'],
      required: true,
    },
    breakdown: {
      ssl: Number,
      scripts: Number,
      forms: Number,
      cookies: Number,
      phishing: Number,
    },
    aiSummary: { type: String, default: '' },
    detectedThreats: [{ type: String }],
    
rawData: {
  type: Schema.Types.Mixed,
  required: true,
  select: false,
}, // Hide from default queries
  },
  { timestamps: true }
);

// Index for fast user report queries
ScanReportSchema.index({ userId: 1, createdAt: -1 });

export const ScanReport = mongoose.model<IScanReport>('ScanReport', ScanReportSchema);