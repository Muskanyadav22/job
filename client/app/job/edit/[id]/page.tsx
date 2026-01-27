"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobsContext } from "@/context/jobsContext";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Header from "@/Components/Header";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { getJobById } = useJobsContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: 0,
    location: "",
    jobType: [] as string[],
    skills: [] as string[],
    tags: [] as string[],
    salaryType: "Year",
    negotiable: false,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(params.id as string);
        if (jobData) {
          setJob(jobData);
          setFormData({
            title: jobData.title || "",
            description: jobData.description || "",
            salary: jobData.salary || 0,
            location: jobData.location || "",
            jobType: jobData.jobType || [],
            skills: jobData.skills || [],
            tags: jobData.tags || [],
            salaryType: jobData.salaryType || "Year",
            negotiable: jobData.negotiable || false,
          });
        } else {
          toast.error("Job not found");
          router.push("/myjobs");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job");
        router.push("/myjobs");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? parseInt(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      // Call update API (you'll need to create this endpoint)
      const response = await fetch(`http://localhost:5000/api/v1/jobs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      toast.success("Job updated successfully!");
      router.push("/myjobs");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Job</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <ReactQuill
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                style={{ minHeight: "300px" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Input
                  id="salaryType"
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/myjobs")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
