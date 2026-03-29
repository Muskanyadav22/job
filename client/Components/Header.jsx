import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus } from "lucide-react";
import Profile from "./Profile";

function Header() {
  const { isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <header className="px-10 py-6 bg-[#D7DEDC] text-gray-500 flex justify-between items-center">
      <button onClick={() => navigate("/")} className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" style={{ width: 45, height: 45 }} />
        <h1 className="font-extrabold text-2xl text-[#7263f3]">JobFindr</h1>
      </button>

      <ul className="flex items-center gap-8">
        <li>
          <button
            onClick={() => navigate("/findwork")}
            className={`py-2 px-6 rounded-md ${
              currentPath === "/findwork"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            Find Work
          </button>
          <button
            onClick={() => navigate("/myjobs")}
            className={`py-2 px-6 rounded-md ${
              currentPath === "/myjobs"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            My Jobs
          </button>
          <button
            onClick={() => navigate("/post")}
            className={`py-2 px-6 rounded-md ${
              currentPath === "/post"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            Post a Job
          </button>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Profile />
        ) : (
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-6 rounded-md border flex items-center gap-4 bg-[#7263F3] text-white border-[#7263F3] hover:bg-[#7263F3]/90 transition-all duration-200 ease-in-out"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="py-2 px-6 rounded-md border flex items-center gap-4 border-[#7263F3] text-[#7263F3] hover:bg-[#7263F3]/10 transition-all duration-200 ease-in-out"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
