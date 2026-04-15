import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    salary: {
      type: Number,
      required: true,
    },
    salaryType: {
      type: String,
      default: "Year",
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    jobType: [
      {
        type: String,
        required: true,
      },
    ],

    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],

    skills: [
      {
        type: String,
        required: true,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    applicants: [
      {
        userId: {
          type:  mongoose.Schema.Types.ObjectId,// 
          ref: "User",
        },
        status: {
          type: String,
          enum: ["applied", "shortlisted", "selected", "rejected"],
          default: "applied",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;
