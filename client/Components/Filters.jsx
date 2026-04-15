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
    actualMaxSalary,
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
                onCheckedChange={() => handleFilterChange(type)}
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
                onCheckedChange={() => handleFilterChange(skill)}
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
          ₹{minSalary.toLocaleString()} - ₹{maxSalary.toLocaleString()}
        </p>
        <div className="mb-4">
          <label className="text-xs text-gray-600">Min Salary</label>
          <Slider
            value={[minSalary]}
            onValueChange={(val) => setMinSalary(Math.min(val[0], actualMaxSalary))}
            max={actualMaxSalary}
            min={0}
            step={1000}
            className="mt-2"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Max Salary</label>
          <Slider
            value={[maxSalary]}
            onValueChange={(val) => setMaxSalary(Math.max(val[0], minSalary))}
            max={actualMaxSalary * 1.2}
            min={minSalary}
            step={1000}
            className="mt-2"
          />
        </div>
      </div>
    </aside>
  );
}

export default Filters;
