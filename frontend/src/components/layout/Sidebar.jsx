import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const base =
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors";
  const getClass = ({ isActive }) =>
    `${base} ${
      isActive
        ? "bg-sky-500/20 text-sky-200"
        : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-100"
    }`;

  return (
    <aside className="hidden md:flex h-full w-56 flex-col rounded-2xl border border-slate-800/70 bg-slate-950/70 p-3 backdrop-blur-xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Navigation
      </p>
      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={getClass}>
          Overview
        </NavLink>
        <NavLink to="/scan" className={getClass}>
          New scan
        </NavLink>
        <NavLink to="/reports" className={getClass}>
          Reports
        </NavLink>
        <NavLink to="/link-qr" className={getClass}>
          Link ➡️ QR
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
