import React from "react";

const RecentScans = ({ reports = [] }) => {
  const total = reports.length;
  if (total === 0) {
    return (
      <div className="tl-card border border-slate-800/70 p-4">
        <p className="text-sm font-medium text-slate-200">Recent scans</p>
        <p className="mt-3 text-sm text-slate-500">
          No scans yet. Run your first scan from the Scan page.
        </p>
      </div>
    );
  }

  return (
    <div className="tl-card border border-slate-800/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-200">Recent scans</p>
        <p className="text-xs text-slate-500">
          Showing last {Math.min(6, total)} results
        </p>
      </div>
      <div className="mt-3 divide-y divide-slate-800/80">
        {reports
          .slice()
          .reverse()
          .slice(0, 6)
          .map((report) => {
            const color =
              report.riskLevel === "safe"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/40"
                : report.riskLevel === "dangerous"
                ? "bg-rose-500/10 text-rose-200 border-rose-400/40"
                : "bg-amber-500/10 text-amber-200 border-amber-400/40";
            return (
              <div
                key={report._id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">
                    {report.url}
                  </p>
                  <p className="text-xs text-slate-500">
                    Score {report.trustScore} ·{" "}
                    {new Date(
                      report.createdAt || Date.now()
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-200">
                    {report.trustScore}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${color}`}
                  >
                    {report.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RecentScans;