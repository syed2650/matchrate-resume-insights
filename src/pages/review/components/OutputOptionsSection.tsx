
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  generateRewrite: boolean;
  setGenerateRewrite: (value: boolean) => void;
  multiVersion: boolean;
  setMultiVersion: (value: boolean) => void;
}

export const OutputOptionsSection: React.FC<Props> = ({
  generateRewrite,
  setGenerateRewrite,
  multiVersion,
  setMultiVersion,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Output Options</h2>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="generate-rewrite"
          checked={generateRewrite}
          onCheckedChange={(value) => setGenerateRewrite(value)}
        />
        <Label htmlFor="generate-rewrite" className="text-slate-700 flex items-center">
          Generate full resume rewrite (optimized for this role and company)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-slate-500 ml-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px]">
                  Our AI will completely rewrite your resume to match this specific job description, 
                  ensuring your experience and skills are presented optimally.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>
      
      {generateRewrite && (
        <div className="flex items-center space-x-2 ml-6">
          <Switch
            id="multi-version"
            checked={multiVersion}
            onCheckedChange={(value) => setMultiVersion(value)}
          />
          <Label htmlFor="multi-version" className="text-slate-700 flex items-center">
            Create multiple versions (Startup, Enterprise, Consulting)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-500 ml-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px]">
                    Get three versions of your resume optimized for different company types: 
                    startups, enterprise companies, and consulting firms.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>
      )}
    </div>
  );
};
