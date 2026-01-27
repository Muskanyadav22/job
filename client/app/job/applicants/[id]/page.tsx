"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState<string | null>(null);

  // Handle params which might be Promise-like in Next.js 15
  useEffect(() => {
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      setJobId(id as string);
    }
  }, [params]);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        if (!jobId) {
          return;
        }

        const token = localStorage.getItem("token");
        
        if (!token) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        // Get job details
        const jobRes = await axios.get(`http://localhost:5000/api/v1/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setJob(jobRes.data);

        // Get applicants for this job
        const applicantsRes = await axios.get(
          `http://localhost:5000/api/v1/jobs/${jobId}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Applicants received:", applicantsRes.data);
        setApplicants(applicantsRes.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobAndApplicants();
    }
  }, [jobId, router]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!jobId || !token) {
        toast.error("Job ID or token not found");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/v1/jobs/${jobId}/applicants/${userId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{job?.title}</h1>
          <p className="text-gray-600">
            {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {applicants.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No applicants yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant, index) => (
              <Card key={applicant._id || index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Image
                      src={applicant.profilePicture || "/user.png"}
                      alt={applicant.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{applicant.name}</h3>
                      <p className="text-gray-600">{applicant.email}</p>
                      {applicant.profession && (
                        <p className="text-sm text-gray-500">{applicant.profession}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Applied on{" "}
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        applicant.status === "applied"
                          ? "bg-blue-100 text-blue-700"
                          : applicant.status === "shortlisted"
                          ? "bg-yellow-100 text-yellow-700"
                          : applicant.status === "selected"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {applicant.status?.charAt(0).toUpperCase() + applicant.status?.slice(1) || "Applied"}
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
                      variant="destructive"
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

        <div className="mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
