import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import JobForm from "@/Components/JobPost/JobForm";
import { useGlobalContext } from "@/context/globalContext";
import { Card } from "@/Components/ui/card";

function PostJobPage() {
  const { isAuthenticated, loading, userProfile } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header />
        <div className="flex-1 pt-8 mx-auto w-[90%] text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== "recruiter") {
    return (
      <div className="flex flex-col">
        <Header />
        <div className="flex-1 pt-8 mx-auto w-[90%] flex justify-center items-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Only recruiters can create job posts. Please switch to a recruiter account to post jobs.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-[#7263f3] text-white rounded-lg hover:bg-[#5a4dcc]"
            >
              Go to Home
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header />

      <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
        Create a Job Post
      </h2>

      <div className="flex-1 pt-8 w-[90%] mx-auto flex justify-center items-center">
        <JobForm />
      </div>
    </div>
  );
}

export default PostJobPage;
