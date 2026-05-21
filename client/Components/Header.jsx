import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import Profile from "./Profile";

function Header() {
  const { isAuthenticated, userProfile } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [];

  if (isAuthenticated && userProfile?.role === "admin") {
    navLinks.push({ label: "Admin Dashboard", path: "/admin" });
  } else {
    navLinks.push({ label: "Find Work", path: "/findwork" });
    if (isAuthenticated && userProfile?.role === "jobseeker") {
      navLinks.push({ label: "My Applications", path: "/applied-jobs" });
    }
    if (userProfile?.role === "jobseeker" || userProfile?.role === "recruiter") {
      navLinks.push({ label: "My Jobs", path: "/myjobs" });
    }
    if (isAuthenticated && userProfile?.role === "recruiter") {
      navLinks.push({ label: "Post a Job", path: "/post" });
    }
  }

  return (
    <header className="bg-[#D7DEDC] text-gray-500 relative">
      <div className="px-4 md:px-8 lg:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => { navigate("/"); setMenuOpen(false); }} className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" width={40} height={40} />
          <span className="font-extrabold text-xl md:text-2xl text-[#7263f3]">JobFindr</span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => navigate(link.path)}
                className={`py-2 px-4 text-sm lg:text-base rounded-md transition-colors ${
                  currentPath === link.path
                    ? "text-[#7263F3] border border-[#7263F3] bg-[#7263F3]/10"
                    : "hover:text-[#7263F3]"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Profile />
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="py-2 px-4 rounded-md flex items-center gap-2 bg-[#7263F3] text-white border border-[#7263F3] hover:bg-[#7263F3]/90 transition-all duration-200 text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="py-2 px-4 rounded-md flex items-center gap-2 border border-[#7263F3] text-[#7263F3] hover:bg-[#7263F3]/10 transition-all duration-200 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile: Profile + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && <Profile />}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#D7DEDC] border-t border-gray-300 px-4 pb-4">
          <ul className="flex flex-col gap-1 mb-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <button
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                  className={`w-full text-left py-2 px-4 text-sm rounded-md transition-colors ${
                    currentPath === link.path
                      ? "text-[#7263F3] border border-[#7263F3] bg-[#7263F3]/10"
                      : "hover:text-[#7263F3] hover:bg-gray-200"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {!isAuthenticated && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-[#7263F3] text-white text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                className="w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 border border-[#7263F3] text-[#7263F3] text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
