import React, { useState } from "react";
import { useGenerateQr, useMyQrLinks } from "../config/qrApi";
import jsPDF from "jspdf";

export default function LinkToQRPage() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState("300x300");
  const [qrData, setQrData] = useState(null);

  const { mutateAsync, isLoading } = useGenerateQr();
  const { data: history = [] } = useMyQrLinks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    const result = await mutateAsync({
      url: url.trim(),
      size,
      color: "e5e7eb",
      bgcolor: "020617",
    });
    setQrData(result);
  };

  const handleDownloadPdf = async () => {
    if (!qrData) return;

    const arrayBuffer = await qrData.blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const imgBase64 = `data:image/png;base64,${btoa(
      String.fromCharCode(...bytes)
    )}`;

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(14);
    doc.text("TrustLens QR Link", pageWidth / 2, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text(url, 40, 70, { maxWidth: pageWidth - 80 });

    doc.addImage(imgBase64, "PNG", (pageWidth - 200) / 2, 100, 200, 200);

    doc.save("trustlens-qr.pdf");
  };

  return (
    <div className="w-full space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
          Link ➜ QR
        </h1>
        <p className="text-sm text-slate-400">
          Generate and save QR codes linked to your account. Download them as PDF for desktop use.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="tl-card border border-slate-800/70 p-4 space-y-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="url"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-32 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-slate-200 focus:border-sky-500"
          >
            <option value="200x200">200 x 200</option>
            <option value="300x300">300 x 300</option>
            <option value="400x400">400 x 400</option>
          </select>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60 transition-colors"
          >
            {isLoading ? "Generating…" : "Generate QR"}
          </button>
        </div>
      </form>

      {qrData && (
        <div className="tl-card border border-slate-800/70 p-6 flex flex-col items-center gap-3">
          <img src={qrData.objectUrl} alt="QR code" className="h-48 w-48" />
          <p className="text-xs text-slate-400 break-all text-center max-w-md">
            {url}
          </p>
          <button
            onClick={handleDownloadPdf}
            className="mt-2 inline-flex items-center justify-center rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
          >
            Download as PDF
          </button>
        </div>
      )}

      <div className="tl-card border border-slate-800/70 p-4">
        <p className="text-xs font-medium text-slate-300 mb-2">
          Your saved QR links
        </p>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">
            No QR codes generated yet.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-300">
            {history.map((item) => (
              <li key={item._id} className="flex justify-between gap-2">
                <span className="truncate max-w-xs">{item.url}</span>
                <span className="text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}