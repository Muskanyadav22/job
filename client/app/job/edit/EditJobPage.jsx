import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import JobForm from "@/Components/JobPost/JobForm";
import { useGlobalContext } from "@/context/globalContext";

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useGlobalContext();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="flex flex-col">
      <Header />

      <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
        Edit Job Post
      </h2>

      <div className="flex-1 pt-8 w-[90%] mx-auto flex justify-center items-center">
        <JobForm jobId={id} />
      </div>
    </div>
  );
}

export default EditJobPage;
