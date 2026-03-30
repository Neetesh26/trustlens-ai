import React from "react";
import { useReports } from "../features/scan/scanApi";
import StatsCard from "../components/dashboard/StatsCard";
import RecentScans from "../components/dashboard/RecentScans";

export default function DashboardPage() {
  const { data = [], isLoading } = useReports();

  if (isLoading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
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
      <div className="w-full space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Security overview
            </h1>
            <p className="text-sm text-slate-400">
              High-level view of website trust across your recent scans.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time scoring powered by TrustLens AI
          </div>
        </header>

        {/* stats row using StatsCard */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total scans"
            value={total}
            helper="All websites scanned in your workspace."
          />
          <StatsCard
            label="Safe"
            value={safe}
            helper="Trust score above 70 and low-risk signals."
            variant="safe"
          />
          <StatsCard
            label="Suspicious"
            value={suspicious}
            helper="Needs manual review before sharing with users."
            variant="warning"
          />
          <StatsCard
            label="Dangerous"
            value={dangerous}
            helper="High phishing / malware risk."
            variant="danger"
          />
        </section>

        {/* recent scans + average score */}
        <section className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
          <RecentScans reports={data} />
          <div className="tl-card border border-slate-800/70 p-4 space-y-3">
            <p className="text-sm font-medium text-slate-200">
              Average trust score
            </p>
            <div className="flex items-center gap-4">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-800 bg-slate-950">
                <span className="text-3xl font-semibold text-slate-50">
                  {avgScore}
                </span>
                <span className="absolute text-[10px] text-slate-500 top-1/2 translate-y-4">
                  /100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                This is the mean trust score across your latest scans. Use it as
                a simple indicator of your current browsing risk surface.
              </p>
            </div>
          </div>
        </section>
      </div>
  );
}