import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import toast from "react-hot-toast";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated, uploadResume } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const job = jobs.find((j) => j._id === id);

  useEffect(() => {
    if (job && userProfile?._id) {
      setIsApplied(
        job.applicants.some(
          (app) =>
            app.userId?.toString() === userProfile._id ||
            app.userId === userProfile._id
        )
      );
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
    tags,
  } = job;

  const { name, profilePicture } = createdBy || {
    name: "Unknown User",
    profilePicture: "/user.png",
  };

  const isOwnJob = userProfile?._id === createdBy?._id;
  const isJobseeker = userProfile?.role === "jobseeker";
  const hasResume = !!userProfile?.resume;

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
    if (isOwnJob) {
      toast.error("You cannot apply to your own job");
      return;
    }
    if (isApplied) {
      toast.error("You have already applied to this job");
      return;
    }
    applyToJob(id);
    setIsApplied(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a PDF file first");
      return;
    }
    setIsUploadingResume(true);
    try {
      await uploadResume(resumeFile);
      toast.success("Resume uploaded! You can now apply.");
      setResumeFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  return (
    <main>
      <Header />

      <div className="p-4 md:p-8 mb-8 mx-auto w-full md:w-[90%] rounded-md flex gap-8">
        <div className="flex-1 bg-white p-6 rounded-md">
          {/* Job Header */}
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

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-3 justify-between items-center mb-6">
            <div className="flex-1 min-w-[80px] py-2 px-4 flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
              <span className="text-sm">Salary</span>
              <span>
                <span className="font-bold">{formatMoney(salary)}</span>
                <span className="font-medium text-gray-500 text-sm">
                  /{salaryType ? `${salaryType.substring(0, 2)}` : ""}
                </span>
              </span>
            </div>

            <div className="flex-1 min-w-[80px] py-2 px-4 flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
              <span className="text-sm">Posted</span>
              <span className="font-bold">{formatDates(createdAt)}</span>
            </div>

            <div className="flex-1 min-w-[80px] py-2 px-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
              <span className="text-sm">Applicants</span>
              <span className="font-bold">{applicants.length}</span>
            </div>

            <div className="flex-1 min-w-[80px] py-2 px-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
              <span className="text-sm">Job Type</span>
              <span className="font-bold">{jobType?.[0]}</span>
            </div>
          </div>

          {/* Job Description */}
          <h2 className="font-bold text-2xl mt-4 mb-2">Job Description</h2>
          <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: description }} />

          {/* ─── Resume Upload Section (shown BEFORE apply button, only for jobseekers) ─── */}
          {isAuthenticated && isJobseeker && !isOwnJob && (
            <div className="mt-6">
              {hasResume ? (
                /* Already has a resume — show status + apply */
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800">Resume uploaded ✓</p>
                    <div className="flex gap-3 mt-0.5">
                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(userProfile.resume)}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#7263f3] hover:underline"
                      >
                        View resume →
                      </a>
                      <a
                        href={userProfile.resume}
                        download
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* No resume — show upload section inline */
                <div className="mb-4 border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-orange-800">
                        Resume required to apply
                      </p>
                      <p className="text-xs text-orange-600 mt-0.5">
                        Upload your resume (PDF, max 5MB) to apply for this job.
                      </p>
                    </div>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                      ${dragOver ? "border-[#7263f3] bg-[#7263f3]/5" : "border-gray-300 bg-white hover:border-[#7263f3]/50"}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("job-resume-input").click()}
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    {resumeFile ? (
                      <div>
                        <p className="text-sm font-medium text-[#7263f3]">{resumeFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600">
                        Click to browse or drag & drop your PDF resume
                      </p>
                    )}
                  </div>

                  <input
                    id="job-resume-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <Button
                    onClick={handleResumeUpload}
                    disabled={!resumeFile || isUploadingResume}
                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isUploadingResume ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Upload className="w-4 h-4" />
                        Upload Resume
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ─── Action Buttons ─── */}
          <div className="mt-2 flex gap-4">
            {isOwnJob ? (
              <Button
                className="flex-1 text-white py-4 rounded-full bg-[#7263f3]"
                onClick={() => navigate(`/job/applicants/${id}`)}
              >
                View Applicants ({applicants?.length || 0})
              </Button>
            ) : isJobseeker ? (
              <Button
                className={`flex-1 text-white py-4 rounded-full transition-all ${
                  isApplied
                    ? "bg-green-500 cursor-not-allowed"
                    : !hasResume
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#7263f3] hover:bg-[#6254e0]"
                }`}
                onClick={handleApply}
                disabled={isApplied || !hasResume}
                title={!hasResume ? "Upload your resume above to apply" : ""}
              >
                {isApplied
                  ? "✓ Applied"
                  : !hasResume
                  ? "Upload Resume to Apply"
                  : "Apply Now"}
              </Button>
            ) : null}
          </div>

          {/* Tags & Skills */}
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
