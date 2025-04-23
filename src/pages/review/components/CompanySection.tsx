
import React from "react";
import { Input } from "@/components/ui/input";

interface Props {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  companyType: string;
  setCompanyType: (value: string) => void;
}

const companyTypes = [
  { value: "startup", label: "Startup" },
  { value: "enterprise", label: "Enterprise" },
  { value: "consulting", label: "Consulting" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "general", label: "General/Other" },
];

export const CompanySection: React.FC<Props> = ({
  jobTitle,
  setJobTitle,
  companyType,
  setCompanyType,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Role & Company</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Title
          </label>
          <Input 
            placeholder="e.g. Product Manager, UX Designer, Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Type
          </label>
          <select 
            className="w-full rounded-xl border border-gray-200 p-2.5 text-gray-700 focus:ring-blue-400 focus:border-blue-400"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
          >
            {companyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
