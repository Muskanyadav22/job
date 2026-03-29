import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from "@/context/globalContext";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import { Calendar } from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

function JobCard({ job, activeJob }) {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);

  const {
    title,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
    salaryType,
    location,
  } = job;

  const { name, profilePicture } = createdBy || {
    name: "Unknown User",
    profilePicture: "/user.png",
  };

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    likeJob(job._id);
  };

  useEffect(() => {
    setIsLiked(job.likes.includes(userProfile._id));
  }, [job.likes, userProfile._id]);

  return (
    <div
      className={`p-6 rounded-lg cursor-pointer transition-all ${
        activeJob ? "bg-[#7263f3] text-white border-2 border-[#7263f3]" : "bg-white border border-gray-200 hover:shadow-lg"
      }`}
      onClick={() => navigate(`/job/${job._id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <img
            src={profilePicture || "/user.png"}
            alt={name}
            style={{ width: 40, height: 40 }}
            className="rounded-full"
          />
          <div>
            <p className={`font-semibold text-sm ${activeJob ? "text-white" : ""}`}>
              {name}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) {
              handleLike();
            } else {
              navigate("/login");
            }
          }}
          className={`text-lg ${isLiked ? "" : activeJob ? "text-white/50" : "text-gray-300"}`}
        >
          {isLiked ? bookmark : bookmarkEmpty}
        </button>
      </div>

      <h3 className={`text-lg font-bold mb-2 ${activeJob ? "text-white" : ""}`}>
        {title}
      </h3>

      <p className={`text-sm mb-3 ${activeJob ? "text-white/80" : "text-gray-600"}`}>
        {location}
      </p>

      <Separator className={activeJob ? "bg-white/20" : ""} />

      <div className="mt-3 flex justify-between items-center text-sm">
        <span className={`font-semibold ${activeJob ? "text-white" : "text-[#7263f3]"}`}>
          {formatMoney(salary, "GBP")}
          <span className="text-xs">/pa</span>
        </span>
        <span className={activeJob ? "text-white/70" : "text-gray-500"}>
          {applicants?.length || 0} applicants
        </span>
      </div>

      <div className={`mt-2 text-xs ${activeJob ? "text-white/70" : "text-gray-500"}`}>
        <Calendar className="inline w-3 h-3 mr-1" />
        {formatDates(createdAt)}
      </div>
    </div>
  );
}

export default JobCard;
