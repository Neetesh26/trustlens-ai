import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const RISK_COLORS = {
  safe: "#10b981",
  suspicious: "#f59e0b",
  dangerous: "#ef4444",
};

const RISK_BG = {
  safe: "rgba(16,185,129,0.10)",
  suspicious: "rgba(245,158,11,0.10)",
  dangerous: "rgba(239,68,68,0.10)",
};

const RISK_BORDER = {
  safe: "rgba(16,185,129,0.25)",
  suspicious: "rgba(245,158,11,0.25)",
  dangerous: "rgba(239,68,68,0.25)",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(2,6,23,0.95)",
        border: "1px solid rgba(148,163,184,0.12)",
        borderRadius: 10,
        padding: "8px 13px",
        fontSize: 11,
        color: "#cbd5e1",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        minWidth: 110,
      }}
    >
      {payload.map((p) => (
        <div
          key={p.dataKey ?? p.name}
          style={{ display: "flex", alignItems: "center", gap: 7 }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: p.color ?? p.fill,
              boxShadow: `0 0 6px ${p.color ?? p.fill}`,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#64748b", textTransform: "capitalize" }}>
            {p.name ?? p.dataKey}:
          </span>
          <span
            style={{
              color: "#f1f5f9",
              fontWeight: 700,
              marginLeft: "auto",
              paddingLeft: 8,
            }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrustRiskCharts({ reports }) {
  const [activeSlice, setActiveSlice] = useState(null);

  if (!reports || reports.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "32px 0",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#1e293b" strokeWidth="1.5" />
          <path
            d="M12 8v4l2.5 2.5"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p style={{ fontSize: 12, color: "#475569", textAlign: "center" }}>
          Run a few scans to see risk distribution and score trends.
        </p>
      </div>
    );
  }

  const riskCounts = ["safe", "suspicious", "dangerous"]
    .map((level) => ({
      name: level,
      value: reports.filter((r) => r.riskLevel === level).length,
    }))
    .filter((d) => d.value > 0);

  const scoreTimeline = [...reports]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((r, idx) => ({
      idx: idx + 1,
      label: new Date(r.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      trustScore: r.trustScore ?? 0,
    }));

  const safe = reports.filter((r) => r.riskLevel === "safe").length;
  const suspicious = reports.filter((r) => r.riskLevel === "suspicious").length;
  const dangerous = reports.filter((r) => r.riskLevel === "dangerous").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          style={{
            width: 3,
            height: 15,
            borderRadius: 99,
            background: "linear-gradient(180deg,#38bdf8,#6366f1)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#cbd5e1",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Risk Insights
        </span>
      </div>

      {/* Pills */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {[
          { key: "safe", label: "Safe", count: safe },
          { key: "suspicious", label: "Suspicious", count: suspicious },
          { key: "dangerous", label: "Dangerous", count: dangerous },
        ].map(({ key, label, count }) => (
          <div
            key={key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              borderRadius: 99,
              background: RISK_BG[key],
              border: `1px solid ${RISK_BORDER[key]}`,
              fontSize: 11,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: RISK_COLORS[key],
                boxShadow: `0 0 5px ${RISK_COLORS[key]}`,
              }}
            />
            <span style={{ color: "#94a3b8" }}>{label}</span>
            <span style={{ color: RISK_COLORS[key], fontWeight: 700 }}>
              {count}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ height: 148, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskCounts}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
                innerRadius={38}
                paddingAngle={3}
                strokeWidth={0}
                onMouseEnter={(_, i) => setActiveSlice(i)}
                onMouseLeave={() => setActiveSlice(null)}
              >
                {riskCounts.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={RISK_COLORS[entry.name] ?? "#64748b"}
                    opacity={
                      activeSlice === null || activeSlice === i ? 1 : 0.3
                    }
                    style={{ transition: "opacity 0.18s", cursor: "pointer" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#f1f5f9",
                lineHeight: 1,
              }}
            >
              {reports.length}
            </span>
            <span
              style={{
                fontSize: 9,
                color: "#475569",
                marginTop: 3,
                letterSpacing: "0.05em",
              }}
            >
              TOTAL
            </span>
          </div>
        </div>

        <div style={{ height: 148 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={scoreTimeline}
              margin={{ top: 6, right: 6, bottom: 0, left: -22 }}
            >
              <defs>
                <linearGradient id="tscGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(30,41,59,0.8)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tick={{ fontSize: 9, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="trustScore"
                name="Trust Score"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#tscGrad)"
                dot={{ r: 2.5, fill: "#38bdf8", strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  fill: "#0ea5e9",
                  stroke: "#fff",
                  strokeWidth: 1.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 12,
          marginTop: -6,
        }}
      >
        <p style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}>
          Distribution across all scanned sites.
        </p>
        <p style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}>
          Trust score trend over recent scans.
        </p>
      </div>
    </div>
  );
}