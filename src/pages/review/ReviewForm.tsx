
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Link2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputWithIcon } from "@/components/ui/input-with-icon";

interface Props {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    role?: string
  ) => Promise<void>;
  isLoading: boolean;
}

const ReviewForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Product Manager");

  const handleSubmit = (e: React.FormEvent) => {
    console.log("🚀 Starting form submission");
    e.preventDefault();
    onSubmit(resume, jobDescription, jobUrl, selectedRole);
    console.log("📤 Form submitted with data:", { resume, jobDescription, jobUrl, selectedRole });
  };

  const jobRoles = [
    "Product Manager",
    "UX Designer",
    "Data Analyst",
    "Software Engineer",
    "Consultant",
  ];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Resume Text
          </label>
          <Textarea
            placeholder="Copy and paste your resume text here..."
            className="min-h-[200px]"
            value={resume}
            onChange={(e) => {
              setResume(e.target.value);
              console.log("✍️ Resume text updated");
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Description
          </label>
          <div className="space-y-4">
            <InputWithIcon
              placeholder="Optional: Paste Job URL (LinkedIn, Indeed, etc.)"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="mb-2"
              icon={<Link2 className="h-4 w-4" />}
            />
            <Textarea
              placeholder="Or paste the job description here..."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required={!jobUrl}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Target Role
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !resume}
          >
            {isLoading ? (
              "Analyzing..."
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Get Feedback
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
