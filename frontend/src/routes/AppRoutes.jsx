import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ScanPage from "../pages/ScanPage";
import ReportsPage from "../pages/ReportsPage";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout"; // ✅ import layout
import LinkToQRPage from "../components/LinkToQRPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES WITH LAYOUT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>   {/* ✅ wrap layout here */}

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/reports" element={<ReportsPage />} />
             <Route path="/link-qr" element={<LinkToQRPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}