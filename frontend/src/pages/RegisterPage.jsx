import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ name, email, password }));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  // simple password strength indicator
  const strength = (() => {
    if (password.length < 6) return { label: "Too weak", color: "bg-rose-500" };
    if (password.length < 10)
      return { label: "Could be stronger", color: "bg-amber-400" };
    return { label: "Strong", color: "bg-emerald-400" };
  })();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="grid w-full max-w-5xl gap-10 md:grid-cols-[1.1fr,1fr] items-center">
          {/* Left: product pitch */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Get started in under 60 seconds
            </span>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Create your{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  TrustLens
                </span>{" "}
                account.
              </h1>
              <p className="max-w-lg text-sm sm:text-base text-slate-300">
                Set up a secure workspace to scan websites, track risk trends,
                and share reports with your team. Free tier includes daily
                scans and full dashboard access.
              </p>
            </div>

            <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  Free forever
                </p>
                <p className="mt-1 text-base font-semibold text-sky-300">
                  5 scans / day
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Upgrade later for unlimited scans and team features.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">
                  Built for security
                </p>
                <p className="mt-1 text-base font-semibold text-emerald-300">
                  JWT + HTTPS
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Follows OWASP best practices and least-privilege access.
                </p>
              </div>
            </div>
          </div>

          {/* Right: register card */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-sky-500/40 via-cyan-400/30 to-emerald-400/20 blur-2 opacity-70" />
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950/80 px-6 py-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:px-8 sm:py-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                    <span className="font-display text-lg">TL</span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/30 blur-md opacity-30" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Create your workspace
                    </p>
                    <p className="text-xs text-slate-400">
                      No credit card required on the free tier
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-200">
                  Free tier included
                </span>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

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
                    {password && (
                      <span className="text-[11px] text-slate-400">
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    {password && (
                      <div
                        className={`h-full rounded-full ${strength.color} transition-all`}
                        style={{
                          width: Math.min(password.length * 10, 100) + "%",
                        }}
                      />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Use at least 10 characters with letters, numbers, and a
                    symbol for stronger security.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {error}
                  </div>
                )}

                {passwordHint && (
                  <p className="text-xs text-amber-300">{passwordHint}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                    loading ? "opacity-80 cursor-wait" : ""
                  }`}
                >
                  {loading ? "Creating your account..." : "Create account"}
                </button>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                  By creating an account you agree to our{" "}
                  <span className="text-slate-300">Acceptable Use</span> and{" "}
                  <span className="text-slate-300">Security</span> policies.
                </p>
              </form>

              <p className="mt-4 text-[11px] text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-sky-300 hover:text-sky-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;