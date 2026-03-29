import React from "react";
import { useJobsContext } from "@/context/jobsContext";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Slider } from "@/Components/ui/slider";

function Filters() {
  const {
    filters,
    handleFilterChange,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
  } = useJobsContext();

  return (
    <aside className="w-[22%] flex flex-col gap-8 bg-white p-6 rounded-lg">
      <div>
        <h3 className="font-bold text-lg mb-4">Job Type</h3>
        <div className="space-y-2">
          {["fullTime", "partTime", "contract", "internship"].map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={type}
                checked={filters[type] || false}
                onChange={() => handleFilterChange(type)}
              />
              <Label htmlFor={type} className="ml-2 cursor-pointer">
                {type === "fullTime"
                  ? "Full Time"
                  : type === "partTime"
                  ? "Part Time"
                  : type === "internship"
                  ? "Internship"
                  : "Contract"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Skills</h3>
        <div className="space-y-2">
          {["fullStack", "backend", "devOps", "uiux"].map((skill) => (
            <div key={skill} className="flex items-center">
              <Checkbox
                id={skill}
                checked={filters[skill] || false}
                onChange={() => handleFilterChange(skill)}
              />
              <Label htmlFor={skill} className="ml-2 cursor-pointer">
                {skill === "fullStack"
                  ? "Full Stack"
                  : skill === "backend"
                  ? "Backend"
                  : skill === "devOps"
                  ? "DevOps"
                  : "UI/UX"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Salary Range</h3>
        <p className="text-sm mb-2">
          £{minSalary} - £{maxSalary}
        </p>
        <Slider
          value={[minSalary]}
          onValueChange={(val) => setMinSalary(val[0])}
          max={300000}
          step={1000}
          className="mb-4"
        />
        <Slider
          value={[maxSalary]}
          onValueChange={(val) => setMaxSalary(val[0])}
          max={300000}
          step={1000}
        />
      </div>
    </aside>
  );
}

export default Filters;
