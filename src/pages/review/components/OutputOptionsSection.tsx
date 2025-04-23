
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  );
};
