import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from "@/context/globalContext";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AppliedJobsPage() {
  const { getAppliedJobs } = useJobsContext();
  const { isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const jobs = await getAppliedJobs();
        setAppliedJobs(jobs);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [isAuthenticated, navigate]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "selected":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return "📋";
      case "shortlisted":
        return "✨";
      case "selected":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📝";
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading applied jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Header />

      <div className="p-8 mb-8 mx-auto w-[90%]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Applied Jobs
          </h1>
          <p className="text-gray-600">
            Track the status of all your job applications
          </p>
        </div>

        {appliedJobs.length === 0 ? (
          <Card className="p-8 text-center bg-white rounded-md">
            <p className="text-gray-500 mb-4">
              You haven't applied to any jobs yet
            </p>
            <button
              onClick={() => navigate("/findwork")}
              className="px-6 py-2 bg-[#7263F3] text-white rounded-md hover:bg-[#7263F3]/90"
            >
              Browse Jobs
            </button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {appliedJobs.map((job) => (
              <Card
                key={job._id}
                className="p-6 bg-white rounded-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {job.title}
                      </h2>
                      <span className="text-sm">
                        {getStatusIcon(job.applicationStatus)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-1">
                      {job.createdBy?.name || "Company"}
                    </p>

                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>📍 {job.location}</span>
                      <span>💰 {formatMoney(job.salary)}/{job.salaryType}</span>
                      <span>
                        📅 Applied {formatDates(job.appliedAt)}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                      {job.jobType?.map((type) => (
                        <Badge
                          key={type}
                          className="bg-purple-100 text-purple-800"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    <div className="flex gap-2 flex-wrap mb-4">
                      {job.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">
                        Application Status
                      </p>
                      <Badge
                        className={`${getStatusBadgeColor(
                          job.applicationStatus
                        )} px-4 py-2 font-semibold capitalize`}
                      >
                        {job.applicationStatus}
                      </Badge>
                    </div>

                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="px-4 py-2 bg-[#7263F3] text-white rounded-md hover:bg-[#7263F3]/90 transition-all text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {appliedJobs.length > 0 && (
          <div className="mt-8 grid grid-cols-4 gap-4">
            {[
              {
                label: "Applied",
                color: "bg-blue-100",
                count: appliedJobs.filter(
                  (j) => j.applicationStatus === "applied"
                ).length,
              },
              {
                label: "Shortlisted",
                color: "bg-yellow-100",
                count: appliedJobs.filter(
                  (j) => j.applicationStatus === "shortlisted"
                ).length,
              },
              {
                label: "Selected",
                color: "bg-green-100",
                count: appliedJobs.filter(
                  (j) => j.applicationStatus === "selected"
                ).length,
              },
              {
                label: "Rejected",
                color: "bg-red-100",
                count: appliedJobs.filter(
                  (j) => j.applicationStatus === "rejected"
                ).length,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} p-4 rounded-md text-center`}
              >
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.count}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AppliedJobsPage;
