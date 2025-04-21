
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Props {
  onSubmit: (resume: string, jobDescription: string) => Promise<void>;
  isLoading: boolean;
}

const ReviewForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(resume, jobDescription);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paste your resume
          </label>
          <Textarea
            placeholder="Copy and paste your resume text here..."
            className="min-h-[200px]"
            value={resume}
            onChange={e => setResume(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paste the job description
          </label>
          <Textarea
            placeholder="Copy and paste the job description here..."
            className="min-h-[200px]"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
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
