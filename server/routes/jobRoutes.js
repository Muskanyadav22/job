import express from "express";
import {
  createJob,
  getJobs,
  getJobsByUser,
  searchJobs,
  applyJob,
  likeJob,
  getJobById,
  deleteJob,
  updateJob,
  getApplicants,
  updateApplicantStatus,
  getAppliedJobs,
} from "../controllers/jobController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// Specific routes should come first
router.post("/jobs", protect, createJob);
router.get("/jobs/search", searchJobs);
router.get("/jobs/applied", protect, getAppliedJobs);
router.get("/jobs/user/:id", protect, getJobsByUser);

// Nested ID routes
router.get("/jobs/:id/applicants", protect, getApplicants);
router.put("/jobs/:id/applicants/:userId", protect, updateApplicantStatus);

// Generic ID routes last
router.get("/jobs", getJobs);
router.get("/jobs/:id", protect, getJobById);
router.put("/jobs/apply/:id", protect, applyJob);
router.put("/jobs/like/:id", protect, likeJob);
router.put("/jobs/:id", protect, updateJob);
router.delete("/jobs/:id", protect, deleteJob);

export default router;
