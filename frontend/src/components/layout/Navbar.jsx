import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TL";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
            <span className="font-display text-base">TL</span>
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/40 blur-md opacity-30" />
          </div>
          <div onClick={() => navigate("/dashboard")} className="cursor-pointer">
            <div className="font-display text-lg leading-tight tracking-tight text-slate-50">
              TrustLens AI
            </div>
            <div className="text-[11px] text-slate-400">
              Real-time website trust scoring
            </div>
          </div>
        </div>

        {/* Right side: profile + actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100">
                  {user.name || user.email}
                </p>
                <p className="text-[11px] text-slate-400">
                  {user.role === "pro" ? "Pro workspace" : "Free workspace"}
                </p>
              </div>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100">
                <span>{initials}</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-900 bg-emerald-400" />
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-full border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 shadow-sm shadow-rose-500/30 transition-colors hover:bg-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;