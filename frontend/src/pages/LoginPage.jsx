import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
// import { apiClient } from "../libs/apiClient";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const [email, setEmail] = useState("mk@gmail.com");
  const [password, setPassword] = useState("Mk@1234567");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState("");

//  const { loading, error } = useSelector((state) => state.auth);
  
 




const handleLogin = async (e) => {
  e.preventDefault();
  setErrors("");

  if (!email || !password) {
    setErrors("Email and password are required.");
    return;
  }

  try {
    setIsSubmitting(true);

    const res = await dispatch(loginUser({ email, password }));
    console.log(">>>>>>res login",res);
    console.log("re login page",res);
    
    if (res) {
      // Optional: if your thunk already sets auth, no need for setAuth
      // dispatch(setAuth(res.payload));
    
      navigate("/dashboard"); // redirect after login
    } else {
      setErrors(res.payload || "Login failed");
    }

  } catch (err) {
    setErrors("Something went wrong");
    console.log(">>>>>>>>",err);
    
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* glow + grid background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="grid w-full max-w-5xl gap-10 md:grid-cols-[1.15fr,1fr] items-center">
          {/* Left: brand + marketing */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live trust scoring for any website
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  TrustLens AI
                </span>
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-slate-300">
                Sign in to your dashboard to run real-time trust checks, review
                risk reports, and monitor how safe your users are when they surf
                the web.
              </p>
            </div>

            <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  Today&apos;s scans
                </p>
                <p className="mt-1 text-xl font-semibold text-sky-300">
                  284
                </p>
                <p className="mt-1 text-[11px] text-emerald-300">
                  +18% vs yesterday
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  High-risk sites
                </p>
                <p className="mt-1 text-xl font-semibold text-rose-300">
                  37
                </p>
                <p className="mt-1 text-[11px] text-rose-300/80">
                  Flagged for phishing
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  Avg. trust score
                </p>
                <p className="mt-1 text-xl font-semibold text-emerald-300">
                  76
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Across last 24h
                </p>
              </div>
            </div>
          </div>

          {/* Right: auth card */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-sky-500/40 via-cyan-400/30 to-emerald-400/20 blur-2 opacity-70" />
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/80 px-6 py-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:px-8 sm:py-8">
              {/* Logo row */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                    <span className="font-display text-lg">TL</span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/30 blur-md opacity-30" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Sign in to TrustLens
                    </p>
                    <p className="text-xs text-slate-400">
                      Secure access to your risk dashboard
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  SOC2-ready UI
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Work email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sky-300 hover:text-sky-200"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Your credentials are transmitted over encrypted connections.
                  </p>
                </div>

                {errors && (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {errors}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-400 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    isSubmitting ? "opacity-80 cursor-wait" : ""
                  }`}
                >
                  {isSubmitting ? "Signing you in..." : "Sign in securely"}
                </button>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-800" />
                  <span>or continue with</span>
                  <span className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
                  >
                    <span className="h-4 w-4 rounded-full bg-slate-700" />
                    SSO (coming soon)
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80"
                  >
                    <span className="h-4 w-4 rounded-full bg-slate-700" />
                    Magic link
                  </button>
                </div>
              </form>

              <p className="mt-4 text-[11px] text-slate-500">
                New to TrustLens?{" "}
                <a
                  href="/register"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Create a free account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}