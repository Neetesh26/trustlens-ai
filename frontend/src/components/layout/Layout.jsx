import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // ✅ import

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-slate-950 to-slate-950" />
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="relative mx-auto flex max-w-6xl gap-4 px-4 pb-6 pt-4">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1">
          <Outlet />   {/* ✅ THIS IS KEY */}
        </main>
      </div>
    </div>
  );
};

export default Layout;