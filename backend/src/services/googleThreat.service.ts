import axios from "axios";
import { getEnv } from "../config/env";

const API_KEY = getEnv("GOOGLE_SAFE_BROWSING_KEY");

export const checkGoogleThreat = async (url: string) => {
  try {
    const res = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        client: {
          clientId: "trustlens-ai",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }
    );

    return res.data.matches || [];
  } catch (err: any) {
    console.log("Google Threat Error:", err.message);
    return [];
  }
};