
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Link2, Loader2, AlertCircle, FileText } from "lucide-react";
import { ExtractionStatus } from "../types";

interface Props {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  jobUrl: string;
  setJobUrl: (value: string) => void;
  extractionStatus: ExtractionStatus;
  onExtract: () => void;
  jobTitle?: string;
  setJobTitle?: (value: string) => void;
}

export const JobDescriptionSection: React.FC<Props> = ({
  jobDescription,
  setJobDescription,
  jobUrl,
  setJobUrl,
  extractionStatus,
  onExtract,
  jobTitle,
  setJobTitle
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-2">
            <InputWithIcon
              placeholder="Paste Job URL (LinkedIn, Indeed, Salesforce, etc.)"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="mb-2 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              icon={<Link2 className="h-4 w-4" />}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="shrink-0 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={onExtract}
              disabled={!jobUrl || extractionStatus.status === 'loading'}
            >
              {extractionStatus.status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : 'Extract'}
            </Button>
          </div>
          
          {extractionStatus.status === 'error' && (
            <div className="flex items-center mt-2 p-3 rounded-lg bg-red-50 text-red-700">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-sm">{extractionStatus.message}</span>
            </div>
          )}
          
          {extractionStatus.status === 'success' && (
            <div className="flex items-center mt-2 p-3 rounded-lg bg-green-50 text-green-700">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm">{extractionStatus.message}</span>
            </div>
          )}
        </div>
        
        <Textarea
          placeholder="Or paste the job description here..."
          className="min-h-[200px] resize-y rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required={!jobUrl}
        />
      </div>
    </div>
  );
};
