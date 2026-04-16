import React from "react";
import { useReports } from "../features/scan/scanApi";
import StatsCard from "../components/dashboard/StatsCard";
import RecentScans from "../components/dashboard/RecentScans";
import TrustRiskCharts from "../components/dashboard/TrustRiskCharts";

export default function DashboardPage() {
  const { data = [], isLoading } = useReports();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    );
  }

  const total = data.length;
  const safe = data.filter((r) => r.riskLevel === "safe").length;
  const dangerous = data.filter((r) => r.riskLevel === "dangerous").length;
  const suspicious = data.filter((r) => r.riskLevel === "suspicious").length;
  const avgScore =
    total > 0
      ? Math.round(
          data.reduce((sum, r) => sum + (r.trustScore || 0), 0) / total
        )
      : 0;

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        {/* header */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-4 sm:px-6 sm:py-5 backdrop-blur-xl shadow-lg shadow-sky-500/10">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                Security overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/85 max-w-xl">
                Monitor website trust, risk levels, and scan history powered by
                TrustLens AI.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11px] sm:text-xs text-emerald-100 shadow-sm shadow-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live scoring active
            </div>
          </header>
        </div>

        {/* top stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total scans"
            value={total}
            helper="All sites you’ve analyzed."
          />
          <StatsCard
            label="Safe"
            value={safe}
            helper="TrustLens AI found no significant risks."
            variant="safe"
          />
          <StatsCard
            label="Suspicious"
            value={suspicious}
            helper="Needs manual review."
            variant="warning"
          />
          <StatsCard
            label="Dangerous"
            value={dangerous}
            helper="High phishing or malware signals."
            variant="danger"
          />
        </section>

        {/* main content */}
        <section className="flex flex-col gap-4">
          {/* TOP: Recent scans full width */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-sky-500/10">
            <RecentScans reports={data} />
          </div>

          {/* BOTTOM: Risk insights + Average score side-by-side */}
          <div className="grid gap-4 lg:grid-cols-[1.7fr,1.1fr]">
            {/* Risk insights */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-sky-500/10">
              <TrustRiskCharts reports={data} />
            </div>

            {/* Average trust score */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-sky-500/10 flex flex-col justify-between">
              <p className="text-sm font-medium text-slate-100">
                Average trust score
              </p>
              <div className="mt-3 flex flex-col gap-4 sm:items-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-slate-800 bg-slate-950 shadow-inner shadow-black/70 sm:h-28 sm:w-28">
                  <span className="text-2xl sm:text-3xl font-semibold text-slate-50">
                    {avgScore}
                  </span>
                  <span className="absolute text-[10px] text-slate-500 top-1/2 translate-y-4">
                    /100
                  </span>
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/25 via-emerald-400/15 to-transparent blur-sm" />
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/85 text-center">
                  The mean trust score across your latest scans. Use this as a
                  quick signal of how risky your current browsing surface is.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}