import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const job = jobs.find((j) => j._id === id);

  useEffect(() => {
    if (job && userProfile?._id) {
      setIsApplied(job.applicants.includes(userProfile._id));
      setIsLiked(job.likes.includes(userProfile._id));
    }
  }, [job, userProfile?._id]);

  if (!job) {
    return (
      <div>
        <Header />
        <div className="p-8">Job not found</div>
      </div>
    );
  }

  const {
    title,
    location,
    description,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
    salaryType,
    negotiable,
    tags,
  } = job;

  const { name, profilePicture } = createdBy || {
    name: "Unknown User",
    profilePicture: "/user.png",
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isApplied) {
      toast.error("You have already applied to this job");
      return;
    }
    applyToJob(id);
    setIsApplied(true);
  };

  return (
    <main>
      <Header />

      <div className="p-8 mb-8 mx-auto w-[90%] rounded-md flex gap-8">
        <div className="flex-1 bg-white p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 relative overflow-hidden rounded-md flex items-center justify-center bg-gray-200">
                <img
                  src={profilePicture || "/user.png"}
                  alt={name || "User"}
                  style={{ width: 45, height: 45 }}
                  className="rounded-md"
                />
              </div>
              <div>
                <p className="font-bold">{name}</p>
                <p className="text-sm">Recruiter</p>
              </div>
            </div>
            <button
              className={`text-2xl ${isLiked ? "text-[#7263f3]" : "text-gray-400"}`}
              onClick={handleLike}
            >
              {isLiked ? bookmark : bookmarkEmpty}
            </button>
          </div>

          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <p className="text-gray-500 mb-4">{location}</p>

          <div className="mt-4 flex gap-4 justify-between items-center mb-6">
            <div className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
              <span className="text-sm">Salary</span>
              <span>
                <span className="font-bold">{formatMoney(salary, "GBP")}</span>
                <span className="font-medium text-gray-500 text-lg">
                  /{salaryType ? `${salaryType.substring(0, 2)}` : ""}
                </span>
              </span>
            </div>

            <div className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
              <span className="text-sm">Posted</span>
              <span className="font-bold">{formatDates(createdAt)}</span>
            </div>

            <div className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
              <span className="text-sm">Applicants</span>
              <span className="font-bold">{applicants.length}</span>
            </div>

            <div className="flex-1 py-2 px-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
              <span className="text-sm">Job Type</span>
              <span className="font-bold">{jobType?.[0]}</span>
            </div>
          </div>

          <h2 className="font-bold text-2xl mt-4 mb-2">Job Description</h2>
          <div
            className="wysiwyg"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="mt-6 flex gap-4">
            <Button
              className={`flex-1 text-white py-4 rounded-full ${
                isApplied ? "bg-green-500" : "bg-[#7263f3]"
              }`}
              onClick={handleApply}
            >
              {isApplied ? "Applied" : "Apply Now"}
            </Button>
          </div>

          <div className="mt-6 p-6 flex flex-col gap-2 bg-white rounded-md border">
            <h3 className="text-lg font-semibold">Tags & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-[#7263f3]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobDetailsPage;
