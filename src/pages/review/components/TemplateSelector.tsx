
import React from "react";
import { templates } from "../../../templates";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-slate-900">Choose Template</h3>
      <RadioGroup
        value={selectedTemplateId}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id}>
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`template-${template.id}`}
              className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div
                className="w-full h-32 rounded-md border"
                style={{
                  backgroundColor: template.secondaryColor,
                  borderColor: template.primaryColor,
                  borderWidth: "2px",
                }}
              >
                <div
                  className="w-full h-8"
                  style={{ backgroundColor: template.primaryColor }}
                ></div>
                <div className="p-2">
                  <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
              <span>{template.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TemplateSelector;
