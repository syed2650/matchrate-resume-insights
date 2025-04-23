
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Link2, Upload, FileUp } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    console.log("🚀 Starting form submission");
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
    console.log("📤 Form submitted with data:", { 
      resume, 
      jobDescription, 
      jobUrl, 
      jobTitle, 
      companyType, 
      generateRewrite,
      multiVersion
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setResumeFile(file);
    setIsParsingResume(true);
    
    try {
      // Here you would integrate with a service like UploadThing or directly
      // extract text using a library. For now, let's simulate with a timeout
      // In a real implementation, you'd use a function call to an API or edge function
      setTimeout(() => {
        // Placeholder for actual text extraction
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string || "Error extracting text from file";
          setResume(text);
          setIsParsingResume(false);
          toast({
            title: "Resume parsed successfully",
            description: `Extracted ${text.length} characters from ${file.name}`,
          });
        };
        reader.readAsText(file);
      }, 1500);
    } catch (error) {
      console.error("Error parsing resume:", error);
      setIsParsingResume(false);
      toast({
        title: "Error parsing resume",
        description: "Failed to extract text from the uploaded file",
        variant: "destructive"
      });
    }
  };

  const handleUrlPaste = async () => {
    if (!jobUrl) return;
    
    toast({
      title: "Processing job URL",
      description: "Attempting to extract job description...",
    });
    
    // In a real implementation, this would call your job scraper edge function
    // For now, we're just acknowledging the URL
    console.log("Job URL to process:", jobUrl);
  };

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Resume</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume-upload"
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileUpload}
                      disabled={isParsingResume}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={isParsingResume}
                    >
                      <FileUp className="h-4 w-4" />
                      {isParsingResume ? "Parsing..." : "Upload File"}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload .pdf, .docx, or .txt resume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Textarea
            placeholder="Copy and paste your resume text here..."
            className="min-h-[200px] resize-y"
            value={resume}
            onChange={(e) => {
              setResume(e.target.value);
              console.log("✍️ Resume text updated");
            }}
            required={!resumeFile}
          />
          
          {resumeFile && (
            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 font-medium">{resumeFile.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-blue-600 h-8 hover:text-red-600"
                onClick={() => setResumeFile(null)}
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
            <div className="flex items-center gap-2">
              <InputWithIcon
                placeholder="Paste Job URL (LinkedIn, Indeed, etc.)"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="mb-2"
                icon={<Link2 className="h-4 w-4" />}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="shrink-0"
                onClick={handleUrlPaste}
                disabled={!jobUrl}
              >
                Extract
              </Button>
            </div>
            <Textarea
              placeholder="Or paste the job description here..."
              className="min-h-[200px] resize-y"
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Type
              </label>
              <select 
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
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

        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Output Options</h2>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="generate-rewrite"
              checked={generateRewrite}
              onCheckedChange={setGenerateRewrite}
            />
            <Label htmlFor="generate-rewrite">
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
              <Label htmlFor="multi-version">
                Create multiple versions (Startup, Enterprise, Consulting)
              </Label>
            </div>
          )}
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 rounded-xl"
            disabled={isLoading || (!resume && !resumeFile)}
          >
            {isLoading ? (
              "Analyzing..."
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
