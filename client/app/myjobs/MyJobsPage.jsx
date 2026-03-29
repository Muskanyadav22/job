import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import MyJob from "@/Components/JobItem/MyJob";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";

function MyJobsPage() {
  const { userJobs, jobs } = useJobsContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();
  const [activeTab, setActiveTab] = React.useState("posts");
  const navigate = useNavigate();
  const userId = userProfile?._id;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const likedJobs = jobs.filter((job) => {
    return job.likes.includes(userId);
  });

  if (loading) {
    return null;
  }

  return (
    <div>
      <Header />

      <div className="mt-8 w-[90%] mx-auto flex flex-col">
        <div className="self-center flex items-center gap-6">
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "posts"
                ? "border-transparent bg-[#7263F3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            My Posts
          </button>
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium ${
              activeTab === "liked"
                ? "border-transparent bg-[#7263F3] text-white"
                : "border-gray-400"
            }`}
            onClick={() => setActiveTab("liked")}
          >
            Liked Jobs
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === "posts"
            ? userJobs.map((job) => <MyJob key={job._id} job={job} />)
            : likedJobs.map((job) => <MyJob key={job._id} job={job} />)}
        </div>

        {(activeTab === "posts" ? userJobs : likedJobs).length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === "posts"
                ? "You haven't posted any jobs yet"
                : "You haven't liked any jobs yet"}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyJobsPage;
