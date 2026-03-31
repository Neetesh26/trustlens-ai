import axios from "axios";
import { QrLink } from "../models/QrLink.model";
import { Types } from "mongoose";

export interface QrOptions {
  size?: string;       // e.g. "300x300"
  color?: string;      // hex without #, e.g. "0F172A"
  bgcolor?: string;    // hex without #, e.g. "020617"
}

export const fetchQrPng = async (data: string, opts: QrOptions = {}) => {
  const params = new URLSearchParams({
    data,
    size: opts.size || "300x300",
  });

  if (opts.color) params.set("color", opts.color);
  if (opts.bgcolor) params.set("bgcolor", opts.bgcolor);

  const url = `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;

  const res = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
};



interface CreateQrLinkInput {
  userId: string;
  url: string;
  size: string;
  color?: string;
  bgcolor?: string;
}

export const createQrLink = async (input: CreateQrLinkInput) => {
  return QrLink.create({
    userId: new Types.ObjectId(input.userId),
    url: input.url,
    size: input.size,
    color: input.color,
    bgcolor: input.bgcolor,
  });
};

export const getUserQrLinks = async (userId: string) => {
  return QrLink.find({ userId }).sort({ createdAt: -1 });
};