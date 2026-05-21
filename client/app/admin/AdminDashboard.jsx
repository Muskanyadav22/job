import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useGlobalContext } from "@/context/globalContext";
import AdminJobsManager from "./components/AdminJobsManager";
import AdminUsersManager from "./components/AdminUsersManager";

function AdminDashboard() {
  const { isAuthenticated, userProfile } = useGlobalContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    // Redirect if not admin after auth resolves
    if (isAuthenticated && userProfile?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, userProfile, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <main>
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage jobs and users</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("jobs")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "jobs"
                    ? "bg-[#7263f3] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Manage Jobs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "users"
                    ? "bg-[#7263f3] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Manage Users
              </button>
            </div>

            {activeTab === "jobs" ? <AdminJobsManager /> : <AdminUsersManager />}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default AdminDashboard;
