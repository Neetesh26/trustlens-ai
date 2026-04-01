import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../libs/apiClient";

export const useGenerateQr = () =>
  useMutation({
    mutationFn: async ({
      url,
      size = "300x300",
      color,
      bgcolor,
    }: {
      url: string;
      size?: string;
      color?: string;
      bgcolor?: string;
    }) => {
      const res = await apiClient.post<ArrayBuffer>(
        "qr/generate",
        { url, size, color, bgcolor },
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([res.data], { type: "image/png" });
      const objectUrl = URL.createObjectURL(blob);
      const id = res.headers["x-qr-id"] as string | undefined;

      return { objectUrl, id, blob };
    },
  });

export const useMyQrLinks = () =>
  useQuery({
    queryKey: ["qr", "mine"],
    queryFn: async () => {
      const res = await apiClient.get("qr/mine");
      return res.data.data; // list from sendSuccess
    },
  });