
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Link2, Upload, FileUp, Loader2, AlertCircle } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/server/uploadthing";
import { ExtractionStatus } from "./types";
import { supabase } from "@/integrations/supabase/client";
import type { OurFileRouter } from "@/server/uploadthing-router";

interface Props {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    role?: string,
    companyType?: string,
    generateRewrite?: boolean,
    multiVersion?: boolean
  ) => Promise<void>;
  isLoading: boolean;
}

const companyTypes = [
  { value: "startup", label: "Startup" },
  { value: "enterprise", label: "Enterprise" },
  { value: "consulting", label: "Consulting" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "general", label: "General/Other" },
];

const ReviewForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyType, setCompanyType] = useState<string>("general");
  const [generateRewrite, setGenerateRewrite] = useState(false);
  const [multiVersion, setMultiVersion] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({ status: 'idle' });
  const { toast } = useToast();

  // Clear extraction status when URL changes
  useEffect(() => {
    if (jobUrl === '') {
      setExtractionStatus({ status: 'idle' });
    }
  }, [jobUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please paste your resume text or upload a resume file",
        variant: "destructive"
      });
      return;
    }
    
    if (!jobDescription && !jobUrl) {
      toast({
        title: "Job information required",
        description: "Please paste a job description or provide a job URL",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(
      resume, 
      jobDescription, 
      jobUrl, 
      jobTitle, 
      companyType, 
      generateRewrite,
      multiVersion
    );
  };

  const handleUrlPaste = async () => {
    if (!jobUrl) return;
    
    setExtractionStatus({ status: 'loading', message: 'Attempting to extract job description...' });
    
    try {
      // Call the edge function to extract job description
      const { data, error } = await supabase.functions.invoke("extract-job-description", {
        body: { url: jobUrl }
      });
      
      if (error) {
        console.error("Error extracting job description:", error);
        setExtractionStatus({ 
          status: 'error', 
          message: 'Failed to extract job description. Please paste it manually.' 
        });
        return;
      }
      
      if (data?.description) {
        setJobDescription(data.description);
        setExtractionStatus({ status: 'success', message: 'Job description extracted successfully!' });
        
        // If job title was also extracted, update it
        if (data.title) {
          setJobTitle(data.title);
        }
        
        toast({
          title: "Job description extracted",
          description: "Successfully extracted job details from the URL",
        });
      } else {
        setExtractionStatus({ 
          status: 'error', 
          message: 'Could not extract job description. Please paste it manually.' 
        });
      }
    } catch (error) {
      console.error("Error in extraction process:", error);
      setExtractionStatus({ 
        status: 'error', 
        message: 'An error occurred during extraction. Please paste job description manually.' 
      });
    }
  };

  return (
    <Card className="p-6 shadow-md rounded-xl border border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Resume</h2>
            <UploadDropzone<OurFileRouter>
              endpoint="resumeUploader"
              onClientUploadComplete={(res) => {
                // Handle the successful upload
                if (res && res.length > 0) {
                  const file = res[0];
                  setResumeFile({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                  } as File);
                  
                  // Set the file URL in state
                  setResume(`File uploaded: ${file.name}`);
                  
                  toast({
                    title: "Resume uploaded successfully",
                    description: `Uploaded ${file.name}`,
                  });
                }
              }}
              onUploadError={(error: Error) => {
                // Handle errors
                toast({
                  title: "Upload failed",
                  description: error.message,
                  variant: "destructive",
                });
              }}
              className="w-40"
            />
          </div>
          
          <div className="relative">
            <Textarea
              placeholder="Copy and paste your resume text here..."
              className="min-h-[200px] resize-y rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              required={!resumeFile}
            />
            
            {isParsingResume && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <span className="mt-2 text-sm font-medium text-blue-600">Parsing resume...</span>
                </div>
              </div>
            )}
          </div>
          
          {resumeFile && (
            <div className="flex items-center bg-blue-50 p-4 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 font-medium">{resumeFile.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-blue-600 h-8 hover:text-red-600"
                onClick={() => {
                  setResumeFile(null);
                  setResume("");
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center gap-2">
                <InputWithIcon
                  placeholder="Paste Job URL (LinkedIn, Indeed, etc.)"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="mb-2 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  icon={<Link2 className="h-4 w-4" />}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={handleUrlPaste}
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
              
              {extractionStatus.status === 'loading' && jobUrl && (
                <div className="absolute top-0 right-0 mt-2 mr-16 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium animate-pulse">
                  Processing job URL
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

        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Output Options</h2>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="generate-rewrite"
              checked={generateRewrite}
              onCheckedChange={setGenerateRewrite}
            />
            <Label htmlFor="generate-rewrite" className="text-slate-700">
              Generate full resume rewrite (optimized for this role and company)
            </Label>
          </div>
          
          {generateRewrite && (
            <div className="flex items-center space-x-2 ml-6">
              <Switch
                id="multi-version"
                checked={multiVersion}
                onCheckedChange={setMultiVersion}
              />
              <Label htmlFor="multi-version" className="text-slate-700">
                Create multiple versions (Startup, Enterprise, Consulting)
              </Label>
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            disabled={isLoading || (!resume && !resumeFile)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Analyze My Resume
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
