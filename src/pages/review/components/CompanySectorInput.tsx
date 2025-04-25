
import React from "react";
import JobSectorDropdown from "./JobSectorDropdown";

type JobSectorType = "saas" | "enterprise" | "public" | "startup" | "consulting" | "general";

interface CompanySectorInputProps {
  selectedSector: JobSectorType;
  onSectorChange: (sector: JobSectorType) => void;
}

const CompanySectorInput: React.FC<CompanySectorInputProps> = ({
  selectedSector,
  onSectorChange
}) => {
  return (
    <div className="space-y-2">
      <JobSectorDropdown 
        selectedSector={selectedSector}
        onSectorChange={onSectorChange}
      />
      <p className="text-xs text-slate-500">
        Selecting a job sector helps tailor your resume's tone and style for specific industries.
      </p>
    </div>
  );
};

export default CompanySectorInput;
