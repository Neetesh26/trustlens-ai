import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../libs/apiClient";

// 🔍 Scan Website
export const useScanWebsite = () => {
  return useMutation({
    mutationFn: async (url) => {
      const res = await apiClient.post("/scan/analyze", { url });
      return res.data.data.report;
    },

    onError: (error) => {
      console.error("Scan Error:", error?.response?.data || error.message);
      alert("Scan failed. Try again.");
    },
  });
};

// 📊 Get Reports History
export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await apiClient.get("/scan/history");
      return res.data.data;
    },
  });
};