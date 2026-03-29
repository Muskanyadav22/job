import React from "react";
import { useJobsContext } from "@/context/jobsContext";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

function SearchForm() {
  const { handleSearchChange, searchQuery, searchJobs } = useJobsContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchJobs();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Job title"
        value={searchQuery.title}
        onChange={(e) => handleSearchChange("title", e.target.value)}
        className="flex-grow"
      />
      <Input
        type="text"
        placeholder="Location"
        value={searchQuery.location}
        onChange={(e) => handleSearchChange("location", e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" className="bg-[#7263f3]">
        Search
      </Button>
    </form>
  );
}

export default SearchForm;
