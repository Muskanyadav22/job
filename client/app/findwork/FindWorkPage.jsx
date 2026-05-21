import React, { useEffect } from "react";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { useGlobalContext } from "@/context/globalContext";
import { useNavigate, useLocation } from "react-router-dom";
import { grip, list, table } from "@/utils/Icons";

function FindWorkPage() {
  const { jobs, loading, handleSearchChange, searchJobs } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [columns, setColumns] = React.useState(3);

  useEffect(() => {
    if (isAuthenticated && userProfile?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, userProfile, navigate]);

  // Read ?search= from URL (navigated from Home page search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      handleSearchChange("title", searchParam);
      // searchJobs is triggered automatically by the context effect when searchQuery changes
    }
  }, [location.search]);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
    return list;
  };

  return (
    <main>
      <Header />

      <div className="relative px-4 md:px-8 lg:px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-6 md:py-8 text-black font-bold text-2xl md:text-3xl">
          Find Your Next Job Here
        </h1>

        <div className="pb-6 md:pb-8 relative z-10">
          <SearchForm />
        </div>

        <img
          src="/woman-on-phone.jpg"
          alt="hero"
          className="clip-path w-[10rem] md:w-[15rem] absolute z-0 top-[0] right-[5rem] md:right-[10rem] h-full object-cover hidden md:block"
        />

        <img
          src="/team.jpg"
          alt="hero"
          className="clip-path-2 rotate-6 w-[10rem] md:w-[15rem] absolute z-0 top-[0] right-[20rem] md:right-[32rem] h-full object-cover hidden lg:block"
        />
      </div>

      <div className="w-full md:w-[95%] lg:w-[90%] mx-auto mb-8 md:mb-14 px-2 md:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-0">
          <h2 className="text-2xl md:text-3xl font-bold text-black py-4 md:py-8">Recent Jobs</h2>

          <button
            onClick={toggleGridColumns}
            className="flex items-center gap-2 md:gap-4 border border-gray-400 px-4 md:px-8 py-2 rounded-full font-medium text-sm md:text-base"
          >
            <span>
              {columns === 3
                ? "Grid View"
                : columns === 2
                ? "Table View"
                : "List View"}
            </span>
            <span className="text-lg">{getIcon()}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <Filters />

          <div
            className={`self-start flex-1 grid gap-4 md:gap-6 lg:gap-8 ${
              columns === 3
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {loading ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 text-lg">No jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default FindWorkPage;
