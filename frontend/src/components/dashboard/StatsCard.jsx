import React from "react";

const colorMap = {
  default:
    "border-slate-800/70 bg-slate-950/70 text-slate-50 accent text-slate-400",
  safe: "border-emerald-500/40 bg-emerald-500/5 text-emerald-100 accent text-emerald-300",
  warning:
    "border-amber-400/40 bg-amber-500/5 text-amber-50 accent text-amber-200",
  danger:
    "border-rose-500/40 bg-rose-500/5 text-rose-50 accent text-rose-200",
};

const StatsCard = ({
  label,
  value,
  helper,
  variant = "default",
  children,
}) => {
  const classes = colorMap[variant] || colorMap.default;
  const [border, bg, text, , accent] = classes.split(" ");

  return (
    <div className={`tl-card p-4 ${border} ${bg}`}>
      <p className={`text-xs font-medium ${accent}`}>{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${text}`}>{value}</p>
      {helper && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {helper}
        </p>
      )}
      {children && <div className="mt-2 text-xs text-slate-400">{children}</div>}
    </div>
  );
};

export default StatsCard;