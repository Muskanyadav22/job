import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import toast from "react-hot-toast";

const JobsContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {
  const { userProfile, getUserProfile } = useGlobalContext();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userJobs, setUserJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]); // Store unfiltered jobs

  const [searchQuery, setSearchQuery] = useState({
    tags: "",
    location: "",
    title: "",
  });

  //filters
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    contract: false,
    fullStack: false,
    backend: false,
    devOps: false,
    uiux: false,
  });

  const [minSalary, setMinSalary] = useState(30000);
  const [maxSalary, setMaxSalary] = useState(120000);

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs");
      console.log("Jobs fetched:", res.data);
      setAllJobs(res.data); // Store all unfiltered jobs
      setJobs(res.data);
    } catch (error) {
      console.error("Error getting jobs", error?.response?.data || error?.message);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await axios.post("/api/v1/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job created successfully");

      setJobs((prevJobs) => [res.data, ...prevJobs]);

      // update userJobs
      if (userProfile._id) {
        setUserJobs((prevUserJobs) => [res.data, ...prevUserJobs]);
        await getUserJobs(userProfile._id);
      }

      await getJobs();
      // return jobId so component can navigate
      return res.data._id;
    } catch (error) {
      console.log("Error creating job", error);
      toast.error(error.response?.data?.message || "Failed to create job");
      throw error;
    }
  };

  const getUserJobs = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs/user/" + userId);

      setUserJobs(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user jobs", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters - refactored to always use fresh state
  const applyFilters = () => {
    if (allJobs.length === 0) return;

    let filteredJobs = [...allJobs];

    // Filter by salary range
    filteredJobs = filteredJobs.filter(
      (job) => job.salary >= minSalary && job.salary <= maxSalary
    );

    // Filter by job type
    const activeJobTypes = [];
    if (filters.fullTime) activeJobTypes.push("Full Time");
    if (filters.partTime) activeJobTypes.push("Part Time");
    if (filters.contract) activeJobTypes.push("Contract");
    if (filters.internship) activeJobTypes.push("Internship");

    if (activeJobTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        job.jobType?.some((type) => activeJobTypes.includes(type))
      );
    }

    // Filter by tags
    const activeTags = [];
    if (filters.fullStack) activeTags.push("fullStack");
    if (filters.backend) activeTags.push("backend");
    if (filters.devOps) activeTags.push("devOps");
    if (filters.uiux) activeTags.push("uiux");

    if (activeTags.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        job.tags?.some((tag) => activeTags.includes(tag))
      );
    }

    // Filter by title
    if (searchQuery.title) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title?.toLowerCase().includes(searchQuery.title.toLowerCase())
      );
    }

    // Filter by location
    if (searchQuery.location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location?.toLowerCase().includes(searchQuery.location.toLowerCase())
      );
    }

    setJobs(filteredJobs);
  };

  // Wrapper function for backward compatibility
  const searchJobs = () => {
    applyFilters();
  };

  // get job by id
  const getJobById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/jobs/${id}`);

      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Error getting job by id", error);
    } finally {
      setLoading(false);
    }
  };

  // like a job
  const likeJob = async (jobId) => {
    console.log("Job liked", jobId);
    try {
      const res = await axios.put(`/api/v1/jobs/like/${jobId}`);

      console.log("Job liked successfully", res);
      toast.success("Job liked successfully");
      getJobs();
    } catch (error) {
      console.log("Error liking job", error);
    }
  };

  // apply to a job
  const applyToJob = async (jobId) => {
    const job = jobs.find((job) => job._id === jobId);

    if (job && job.applicants.includes(userProfile._id)) {
      toast.error("You have already applied to this job");
      return;
    }

    try {
      const res = await axios.put(`/api/v1/jobs/apply/${jobId}`);

      toast.success("Applied to job successfully");
      getJobs();
    } catch (error) {
      console.log("Error applying to job", error);
      toast.error(error.response.data.message);
    }
  };

  // delete a job
  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/v1/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setUserJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

      toast.success("Job deleted successfully");
    } catch (error) {
      console.log("Error deleting job", error);
    }
  };

  //
  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  // Apply filters whenever ANY of them change
  useEffect(() => {
    applyFilters();
  }, [filters, minSalary, maxSalary, searchQuery, allJobs]);

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (userProfile._id) {
      getUserJobs(userProfile._id);
    }
  }, [userProfile._id]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        loading,
        createJob,
        userJobs,
        searchJobs,
        getJobById,
        likeJob,
        applyToJob,
        deleteJob,
        handleSearchChange,
        searchQuery,
        setSearchQuery,
        handleFilterChange,
        filters,
        minSalary,
        setMinSalary,
        maxSalary,
        setMaxSalary,
        setFilters,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = () => {
  return useContext(JobsContext);
};
