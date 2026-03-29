import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from "@/context/globalContext";
import { formatDates } from "@/utils/fotmatDates";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";
import toast from "react-hot-toast";

function MyJob({ job }) {
  const { deleteJob, likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    likeJob(job._id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJob(job._id);
      toast.success("Job deleted successfully");
    }
  };

  useEffect(() => {
    if (userProfile?._id) {
      setIsLiked(job.likes.includes(userProfile._id));
    }
  }, [job.likes, userProfile?._id]);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-3">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => navigate(`/job/${job._id}`)}
        >
          <img
            src={job.createdBy?.profilePicture || "/user.png"}
            alt={job.title}
            style={{ width: 50, height: 50 }}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.location}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (isAuthenticated) {
                handleLike();
              } else {
                navigate("/login");
              }
            }}
            className={`text-xl ${isLiked ? "text-[#7263f3]" : "text-gray-400"}`}
          >
            {isLiked ? bookmark : bookmarkEmpty}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/job/edit/${job._id}`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {job.tags?.map((tag, idx) => (
          <Badge key={idx} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Posted {formatDates(job.createdAt)}
      </p>
    </div>
  );
}

export default MyJob;
