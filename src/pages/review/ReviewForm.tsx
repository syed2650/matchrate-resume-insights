
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
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/server/uploadthing-router";
import { InputWithIcon } from "@/components/ui/input-with-icon";

interface Props {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    role?: string,
    file?: File
  ) => Promise<void>;
  isLoading: boolean;
}

interface UploadedFile {
  fileName: string;
  fileUrl: string;
}

const ReviewForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Product Manager");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    console.log("🚀 Starting form submission");
    e.preventDefault();
    onSubmit(resume, jobDescription, jobUrl, selectedRole, undefined);
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
            Upload Resume or Paste Text
          </label>
          {!uploadedFile ? (
            <div>
              <UploadDropzone<OurFileRouter>
                endpoint="resumeUploader"
                onUploadError={(error) => {
                  console.log("⚠️ Upload error:", error.message);
                }}
                onUploadBegin={() => {
                  console.log("🚀 Starting file upload");
                }}
                onClientUploadComplete={(res) => {
                  console.log("✅ Upload completed:", res);
                  if (res && res[0]) {
                    setUploadedFile({
                      fileName: res[0].name,
                      fileUrl: res[0].url,
                    });
                    setResume(res[0].name);
                    console.log("📄 File processed:", res[0].name);
                  }
                }}
              />
              <div className="text-center my-4">or</div>
              <Textarea
                placeholder="Copy and paste your resume text here..."
                className="min-h-[200px]"
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  console.log("✍️ Resume text updated");
                }}
                required={!uploadedFile}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
              <span>{uploadedFile.fileName}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadedFile(null);
                  setResume("");
                  console.log("🗑️ File removed");
                }}
              >
                Remove
              </Button>
            </div>
          )}
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
            disabled={isLoading || (!resume && !uploadedFile)}
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
