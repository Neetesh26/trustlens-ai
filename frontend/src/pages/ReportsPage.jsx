import React, { useState } from "react";
import { useReports } from "../features/scan/scanApi";
import { jsPDF } from "jspdf";

export default function ReportsPage() {
  const { data = [], isLoading, error } = useReports();
  const [selectedId, setSelectedId] = useState(null);

  const selected =
    data.find((r) => r._id === selectedId) ||
    (data.length > 0 ? data[0] : null);

  const handleDownloadPDF = () => {
    if (!selected) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("TrustLens AI Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`URL: ${selected.url}`, 20, 40);
    doc.text(`Trust Score: ${selected.trustScore}/100`, 20, 50);
    doc.text(`Risk Level: ${selected.riskLevel.toUpperCase()}`, 20, 60);
    doc.text(`AI Summary:`, 20, 75);
    doc.text(selected.aiSummary || "No summary available.", 20, 85, {
      maxWidth: 170,
    });
    doc.save(`Report-${selected.trustScore}.pdf`);
  };
  console.log(selected?.detectedThreats);
  const shareText = `Trust Score for ${selected?.url}: ${selected?.trustScore}/100`;
  const shareUrl = window.location.href;

  const links = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    mail: `mailto:?subject=TrustLens Report&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading reports…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-rose-300">
          Error loading reports. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 space-y-5">
        <header className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Scan reports
          </h1>
          <p className="text-sm text-slate-400">
            Explore historical scans, trust scores, and AI-generated risk
            summaries.
          </p>
        </header>

        {data.length === 0 ? (
          <p className="text-sm text-slate-400">
            No reports yet. Run a scan first.
          </p>
        ) : (
          <section className="grid gap-4 md:grid-cols-[1.1fr,1.4fr]">
            {/* LEFT */}
            <div className="tl-card border border-slate-800/70 max-h-[70vh] overflow-y-auto">
              <div className="border-b border-slate-800/70 px-4 py-3 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-300">
                  Recent reports
                </p>
                <span className="text-[11px] text-slate-500">
                  {data.length} total
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {data
                  .slice()
                  .reverse()
                  .map((report) => {
                    const isActive = selected?._id === report._id;
                    const color =
                      report.riskLevel === "safe"
                        ? "text-emerald-300"
                        : report.riskLevel === "dangerous"
                          ? "text-rose-300"
                          : "text-amber-300";

                    return (
                      <button
                        key={report._id}
                        onClick={() => setSelectedId(report._id)}
                        className={`w-full text-left px-4 py-3 text-xs transition-colors ${
                          isActive
                            ? "bg-sky-500/15 border-l-2 border-l-sky-400"
                            : "hover:bg-slate-900/60"
                        }`}
                      >
                        <p className="truncate text-sm font-medium text-slate-100">
                          {report.url}
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="font-mono text-[11px] text-slate-300">
                            Score {report.trustScore}
                          </span>
                          <span className={color}>
                            {report.riskLevel.toUpperCase()}
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {new Date(
                            report.createdAt || Date.now(),
                          ).toLocaleString()}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="tl-card border border-slate-800/70 p-4 sm:p-5 flex flex-col h-full">
              {selected ? (
                <>
                  <div className="flex-grow">
                    {/* HEADER */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">
                          URL
                        </p>
                        <p className="truncate font-mono text-sm text-sky-200">
                          {selected.url}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {new Date(
                            selected.createdAt || Date.now(),
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-400">
                          Trust score
                        </p>
                        <p className="text-3xl font-semibold text-slate-50">
                          {selected.trustScore}
                        </p>
                        <p
                          className={`mt-1 text-xs font-medium ${
                            selected.riskLevel === "safe"
                              ? "text-emerald-300"
                              : selected.riskLevel === "dangerous"
                                ? "text-rose-300"
                                : "text-amber-300"
                          }`}
                        >
                          {selected.riskLevel.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* BREAKDOWN */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-5 text-xs text-slate-300">
                      <div>
                        <p className="text-[11px] text-slate-400">SSL</p>
                        <p>{selected.breakdown?.ssl ?? "—"} / 20</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Scripts</p>
                        <p>{selected.breakdown?.scripts ?? "—"} / 20</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Forms</p>
                        <p>{selected.breakdown?.forms ?? "—"} / 20</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Cookies</p>
                        <p>{selected.breakdown?.cookies ?? "—"} / 20</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Phishing</p>
                        <p>{selected.breakdown?.phishing ?? "—"} / 20</p>
                      </div>
                    </div>

                    {/* 🔥 ADVANCED DATA */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs text-slate-300">
                      <div>
                        <p className="text-[11px] text-slate-400">Threats</p>

                        {selected?.detectedThreats?.length ? (
                          <ul className="text-xs text-rose-300 space-y-1 mt-1">
                            {selected.detectedThreats.map((threat, i) => (
                              <li key={i}>⚠️ {threat}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-emerald-300">None</p>
                        )}
                      </div>

                      {/* <div className="mt-3">
  <p className="text-[11px] text-slate-400">Trackers</p>
  <p className="text-xs">
    {selected.trackers?.length
      ? selected.trackers.join(", ")
      : "None"}
  </p>
</div> */}

                      <div className="mt-3">
                        <p className="text-[11px] text-slate-400">
                          External Domains
                        </p>
                        <p className="text-xs">
                          {selected.externalDomains?.length || 0}
                        </p>
                      </div>
                    </div>

                    {/* ALERTS */}
                    <div className="mt-4 text-xs">
                      {selected.isPhishingRisk && (
                        <p className="text-rose-300">
                          ⚠️ Phishing risk detected
                        </p>
                      )}
                      {selected.isClickjackingRisk && (
                        <p className="text-amber-300">
                          ⚠️ Clickjacking risk detected
                        </p>
                      )}
              
                    </div>

                    {/* AI SUMMARY */}
                    <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                      <p className="text-xs font-medium text-slate-300 mb-1">
                        AI risk summary
                      </p>
                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {selected.aiSummary || "No AI summary generated."}
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                    >
                      📥 Download Report
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        Share
                      </span>

                      <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        title="LinkedIn"
                        className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-full text-sky-400 transition-colors border border-slate-800"
                      >
                        L
                      </a>

                      <a
                        href={links.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp"
                        className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-full text-emerald-400 transition-colors border border-slate-800"
                      >
                        W
                      </a>

                      <a
                        href={links.mail}
                        title="Email"
                        className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-full text-rose-400 transition-colors border border-slate-800"
                      >
                        @
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <p>Select report</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
