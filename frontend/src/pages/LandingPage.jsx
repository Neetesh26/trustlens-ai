import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/15 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AI-powered website trust analyzer
        </span>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          See how{" "}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            safe
          </span>{" "}
          any website really is.
        </h1>

        <p className="max-w-xl text-sm sm:text-base text-slate-300">
          TrustLens AI inspects SSL, scripts, forms, trackers and phishing
          signals in real time, then generates a clear trust score and human
          readable risk summary.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Sign in to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;