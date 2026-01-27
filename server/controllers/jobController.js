import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

export const createJob = asyncHandler(async (req, res) => {
  try {
    // Get user from JWT token (set by protect middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const {
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!salary) {
      return res.status(400).json({ message: "Salary is required" });
    }

    if (!jobType) {
      return res.status(400).json({ message: "Job Type is required" });
    }

    if (!tags) {
      return res.status(400).json({ message: "Tags are required" });
    }

    if (!skills) {
      return res.status(400).json({ message: "Skills are required" });
    }

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
      createdBy: user._id,
    });

    await job.save();

    return res.status(201).json(job);
  } catch (error) {
    console.log("Error in createJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get jobs
export const getJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 }); // sort by latest job

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobs: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get jobs by user
export const getJobsByUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await Job.find({ createdBy: user._id })
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobsByUser: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// search jobs
export const searchJobs = asyncHandler(async (req, res) => {
  try {
    const { tags, location, title } = req.query;

    let query = {};

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(query).populate(
      "createdBy",
      "name profilePicture"
    );

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in searchJobs: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// apply for job
export const applyJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = req.user; // From JWT middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already applied
    const alreadyApplied = job.applicants.some(
      (app) => app.userId.toString() === user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    job.applicants.push({
      userId: user._id,
      status: "applied",
      appliedAt: new Date(),
    });

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in applyJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// liek and unlike job
export const likeJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = req.user; // From JWT middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = job.likes.includes(user._id);

    if (isLiked) {
      job.likes = job.likes.filter((like) => !like.equals(user._id));
    } else {
      job.likes.push(user._id);
    }

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in likeJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate(
      "createdBy",
      "name profilePicture"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in getJobById: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// update job
export const updateJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // From JWT middleware

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the job creator
    if (job.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    // Update job fields
    const { title, description, location, salary, jobType, tags, skills, salaryType, negotiable } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (jobType) job.jobType = jobType;
    if (tags) job.tags = tags;
    if (skills) job.skills = skills;
    if (salaryType) job.salaryType = salaryType;
    if (negotiable !== undefined) job.negotiable = negotiable;

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in updateJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

// delete job
export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    const user = req.user; // From JWT middleware

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await job.deleteOne({
      _id: id,
    });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("Error in deleteJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export const getApplicants = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    // Populate applicants with userId reference
    const job = await Job.findById(id).populate({
      path: "createdBy",
      select: "name email"
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the job creator
    if (job.createdBy._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applicants" });
    }

    console.log("Job applicants raw data:", job.applicants);

    // Get all applicants with their details
    const applicants = [];
    
    for (const applicant of job.applicants) {
      // Handle both old format (direct ID) and new format (object with userId)
      let userId = null;
      let status = applicant.status || "applied";
      let appliedAt = applicant.appliedAt || new Date();

      if (applicant.userId) {
        userId = applicant.userId;
      } else if (applicant._id) {
        userId = applicant._id;
      } else {
        userId = applicant;
      }

      console.log("Looking for user:", userId);

      const applicantUser = await User.findById(userId);
      
      console.log("Found user:", applicantUser?.name, "for ID:", userId);

      // Always add applicant, show name from database
      applicants.push({
        _id: userId.toString(),
        name: applicantUser?.name || "Unknown User",
        email: applicantUser?.email || "N/A",
        profession: applicantUser?.profession || "",
        profilePicture: applicantUser?.profilePicture || "/user.png",
        status: status,
        appliedAt: appliedAt,
        createdAt: appliedAt,
      });
    }

    console.log("Returning applicants:", applicants);
    return res.status(200).json(applicants);
  } catch (error) {
    console.log("Error in getApplicants: ", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

export const updateApplicantStatus = asyncHandler(async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const job = await Job.findById(id).populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is the job creator
    if (job.createdBy._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update applicant status" });
    }

    // Validate status
    const validStatuses = ["applied", "shortlisted", "selected", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update applicant status - handle both old and new formats
    let applicantIndex = -1;
    for (let i = 0; i < job.applicants.length; i++) {
      const app = job.applicants[i];
      let appUserId = "";
      
      // Handle both old format (direct ObjectId) and new format (object with userId)
      if (app.userId) {
        appUserId = app.userId.toString();
      } else if (app._id) {
        appUserId = app._id.toString();
      } else {
        appUserId = app.toString();
      }
      
      if (appUserId === userId) {
        applicantIndex = i;
        break;
      }
    }

    if (applicantIndex === -1) {
      console.log("Applicant not found. Looking for:", userId, "In:", job.applicants);
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Update applicant - convert to new format if needed
    if (job.applicants[applicantIndex].userId !== undefined) {
      job.applicants[applicantIndex].status = status;
    } else {
      // Convert from old format (just ID) to new format
      const oldUserId = job.applicants[applicantIndex];
      job.applicants[applicantIndex] = {
        userId: oldUserId,
        status: status,
        appliedAt: new Date(),
      };
    }

    await job.save();

    return res.status(200).json({
      message: "Applicant status updated successfully",
      applicant: job.applicants[applicantIndex],
    });
  } catch (error) {
    console.log("Error in updateApplicantStatus: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});
