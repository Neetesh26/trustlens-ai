import React, { useState, useEffect } from "react";
import { useScanWebsite } from "../features/scan/scanApi";

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const { mutate, data, isPending, error } = useScanWebsite();

  const [localError, setLocalError] = useState("");

  const handleScan = () => {
    setLocalError("");
    if (!url) {
      setLocalError("Please enter a URL to scan.");
      return;
    }
    mutate(url);
  };

  useEffect(() => {
    if (error) {
        console.log(">error scanpage",error);
        
      setLocalError(
        error?.response?.data?.message || "Scan failed. Please try again."
      );
    }
  }, [error]);

  const riskColor =
    data?.riskLevel === "safe"
      ? "text-emerald-300"
      : data?.riskLevel === "dangerous"
      ? "text-rose-300"
      : "text-amber-300";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/12 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-6 space-y-6">
        <header className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Scan a website
          </h1>
          <p className="text-sm text-slate-400">
            TrustLens will analyze SSL, scripts, forms, trackers and phishing
            patterns to compute a trust score.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-[1.35fr,1fr]">
          {/* left: form + animated radar */}
          <div className="tl-card border border-slate-800/70 p-4 sm:p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Website URL
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                We recommend scanning only sites you or your users actually
                visit (no internal admin URLs).
              </p>
            </div>

            {localError && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {localError}
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={isPending}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                isPending ? "opacity-80 cursor-wait" : ""
              }`}
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                  Scanning…
                </>
              ) : (
                "Run scan"
              )}
            </button>

            <div className="mt-4 grid gap-3 text-xs text-slate-400 sm:grid-cols-3">
              <div>
                <p className="font-medium text-slate-300">What we check</p>
                <p>SSL, trackers, suspicious JS, hidden forms, redirects.</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">Response time</p>
                <p>Typically under 2–3 seconds per URL.</p>
              </div>
              <div>
                <p className="font-medium text-slate-300">Data safety</p>
                <p>We do not store page content, only signals and metrics.</p>
              </div>
            </div>
          </div>

          {/* right: radar + last result */}
          <div className="tl-card border border-slate-800/70 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-200">
                Scan visualizer
              </p>
              <span className="text-[11px] text-slate-500">
                {data?.riskLevel
                  ? data.riskLevel.toUpperCase()
                  : "Awaiting scan"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 rounded-full border border-slate-800" />
                <div className="absolute inset-4 rounded-full border border-slate-800/60" />
                <div className="absolute inset-8 rounded-full border border-slate-800/40" />
                <div className="absolute inset-12 rounded-full border border-slate-800/30" />

                <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-sky-500/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-sky-500/15 blur-xl" />
                </div>

                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-8 w-8 animate-ping rounded-full bg-sky-400/80" />
                  </div>
                )}

                {data && !isPending && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-xs text-slate-400">Trust score</span>
                    <span className="text-3xl font-semibold text-slate-50">
                      {data.trustScore}
                    </span>
                    <span className={`text-xs font-medium ${riskColor}`}>
                      {data.riskLevel.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 text-center max-w-xs">
                Visual representation of the scan. The ring intensity reflects
                script, cookie and phishing indicators.
              </p>
            </div>
          </div>
        </section>

        {data && (
          <section className="tl-card border border-slate-800/70 p-4 sm:p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Last scanned URL
                </p>
                <p className="truncate font-mono text-sm text-sky-200">
                  {data.url}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>SSL: {data.breakdown?.ssl ?? "—"}/20</span>
                <span>Scripts: {data.breakdown?.scripts ?? "—"}/20</span>
                <span>Forms: {data.breakdown?.forms ?? "—"}/20</span>
                <span>Cookies: {data.breakdown?.cookies ?? "—"}/20</span>
                <span>Phishing: {data.breakdown?.phishing ?? "—"}/20</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              {data.aiSummary}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}