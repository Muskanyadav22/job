import React from "react";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { grip, list, table } from "@/utils/Icons";

function FindWorkPage() {
  const { jobs, loading } = useJobsContext();
  const [columns, setColumns] = React.useState(3);

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

      <div className="relative px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-8 text-black font-bold text-3xl">
          Find Your Next Job Here
        </h1>

        <div className="pb-8 relative z-10">
          <SearchForm />
        </div>

        <img
          src="/woman-on-phone.jpg"
          alt="hero"
          className="clip-path w-[15rem] absolute z-0 top-[0] right-[10rem] h-full object-cover"
        />

        <img
          src="/team.jpg"
          alt="hero"
          className="clip-path-2 rotate-6 w-[15rem] absolute z-0 top-[0] right-[32rem] h-full object-cover"
        />
      </div>

      <div className="w-[90%] mx-auto mb-14">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-black py-8">Recent Jobs</h2>

          <button
            onClick={toggleGridColumns}
            className="flex items-center gap-4 border border-gray-400 px-8 py-2 rounded-full font-medium"
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

        <div className="flex gap-8">
          <Filters />

          <div
            className={`self-start flex-1 grid gap-8 ${
              columns === 3
                ? "grid-cols-3"
                : columns === 2
                ? "grid-cols-2"
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
