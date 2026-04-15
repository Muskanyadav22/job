import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function JobApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const jobRes = await axios.get(`${API_URL}/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJob(jobRes.data);

        const applicantsRes = await axios.get(
          `${API_URL}/api/v1/jobs/${id}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplicants(applicantsRes.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobAndApplicants();
    }
  }, [id, navigate]);

  const handleUpdateStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!id || !token) {
        toast.error("Job ID or token not found");
        return;
      }

      await axios.put(
        `${API_URL}/api/v1/jobs/${id}/applicants/${userId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === userId ? { ...app, status } : app
        )
      );

      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{job?.title}</h1>
            <p className="text-gray-600">
              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/job/${id}`)}
          >
            Back to Job
          </Button>
        </div>

        {applicants.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No applicants yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <Card key={applicant._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={applicant.profilePicture || "/user.png"}
                      alt={applicant.name}
                      style={{ width: 64, height: 64 }}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{applicant.name}</h3>
                      <p className="text-gray-600">{applicant.email}</p>
                      {applicant.profession && (
                        <p className="text-sm text-gray-500">{applicant.profession}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Applied on {new Date(applicant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          applicant.status === "applied"
                            ? "bg-blue-100 text-blue-700"
                            : applicant.status === "shortlisted"
                            ? "bg-yellow-100 text-yellow-700"
                            : applicant.status === "selected"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {applicant.status?.charAt(0).toUpperCase() +
                          applicant.status?.slice(1) || "Applied"}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(applicant._id, "shortlisted")}
                      disabled={applicant.status === "shortlisted"}
                    >
                      Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(applicant._id, "selected")}
                      disabled={applicant.status === "selected"}
                    >
                      Select
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(applicant._id, "rejected")}
                      disabled={applicant.status === "rejected"}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicantsPage;
