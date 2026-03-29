import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ContextProvider from "@/providers/ContextProvider";

// Page components
import Home from "@/app/Home";
import LoginPage from "@/app/login/LoginPage";
import SignupPage from "@/app/signup/SignupPage";
import FindWorkPage from "@/app/findwork/FindWorkPage";
import PostJobPage from "@/app/post/PostJobPage";
import MyJobsPage from "@/app/myjobs/MyJobsPage";
import JobDetailsPage from "@/app/job/JobDetailsPage";
import JobApplicantsPage from "@/app/job/applicants/JobApplicantsPage";
import EditJobPage from "@/app/job/edit/EditJobPage";
import ProfilePage from "@/app/profile/ProfilePage";

// Loading component
function LoadingPage() {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
}

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Toaster position="top-center" />
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/findwork" element={<FindWorkPage />} />

            {/* Protected Routes */}
            <Route path="/post" element={<PostJobPage />} />
            <Route path="/myjobs" element={<MyJobsPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/job/applicants/:id" element={<JobApplicantsPage />} />
            <Route path="/job/edit/:id" element={<EditJobPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
