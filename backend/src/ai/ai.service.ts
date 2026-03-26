import axios from "axios";

export const analyzeRisk = async (data: any) => {
  const prompt = `
Analyze this website data and detect risk:
${JSON.stringify(data)}

Return JSON:
{ score: number, reason: string }
`;

  const response = await axios.post(
    "YOUR_LLM_API",
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI_KEY}`,
      },
    }
  );

  return response.data;
};