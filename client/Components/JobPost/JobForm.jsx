import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import toast from "react-hot-toast";

function JobForm({ jobId }) {
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const { createJob } = useJobsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    salary: 50000,
    salaryType: "Yearly",
    negotiable: false,
    jobType: ["Full Time"],
    tags: [],
    skills: [],
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleJobTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter((t) => t !== type)
        : [...prev.jobType, type],
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const jobData = {
        ...formData,
        createdBy: userProfile._id,
      };

      console.log("Submitting job data:", jobData);
      const newJobId = await createJob(jobData);
      if (newJobId) {
        toast.success("Job posted successfully!");
        navigate(`/job/${newJobId}`);
      }
    } catch (error) {
      console.error("Error creating job:", error?.response?.data || error?.message);
      toast.error(error?.response?.data?.message || "Failed to create job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl w-full space-y-6 bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold">Create a New Job Post</h2>

      <div>
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior Developer"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., London, UK"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Job Description *</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job role and responsibilities..."
          className="w-full p-2 border rounded-md"
          rows="6"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salary">Salary (Annual) *</Label>
          <Input
            id="salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            placeholder="50000"
            required
          />
        </div>

        <div>
          <Label htmlFor="salaryType">Salary Type</Label>
          <select
            id="salaryType"
            name="salaryType"
            value={formData.salaryType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option>Yearly</option>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Hourly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <Checkbox
            name="negotiable"
            checked={formData.negotiable}
            onChange={handleChange}
          />
          <span>Salary is negotiable</span>
        </label>
      </div>

      <div>
        <Label>Job Type</Label>
        <div className="space-y-2">
          {["Full Time", "Part Time", "Contract", "Internship"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <Checkbox
                checked={formData.jobType.includes(type)}
                onChange={() => handleJobTypeChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags.join(", ")}
          onChange={handleTagsChange}
          placeholder="e.g., React, Node.js, MongoDB"
        />
      </div>

      <div>
        <Label htmlFor="skills">Required Skills (comma-separated)</Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills.join(", ")}
          onChange={handleSkillsChange}
          placeholder="e.g., JavaScript, TypeScript, REST APIs"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#7263f3] text-white"
      >
        {isLoading ? "Creating Job..." : "Post Job"}
      </Button>
    </form>
  );
}

export default JobForm;
