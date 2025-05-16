
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
                className="w-full h-44 rounded-md border overflow-hidden"
                style={{
                  borderColor: template.primaryColor,
                  borderWidth: "1px",
                }}
              >
                {/* Template Preview */}
                {template.id === "modern" && (
                  <div className="h-full w-full">
                    {/* Modern Template Preview */}
                    <div
                      className="h-8 w-full text-center text-white text-xs flex items-center justify-center"
                      style={{ backgroundColor: template.primaryColor }}
                    >
                      NAME
                    </div>
                    <div className="flex h-[calc(100%-32px)]">
                      <div className="w-[70%] p-2">
                        <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-3/4 h-3 bg-gray-300 rounded mb-1"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-3"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div
                        className="w-[30%] p-2"
                        style={{ backgroundColor: template.secondaryColor }}
                      >
                        <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "professional" && (
                  <div className="h-full w-full">
                    {/* Professional Template Preview */}
                    <div className="text-center p-2">
                      <div 
                        className="h-4 w-1/2 mx-auto rounded mb-1" 
                        style={{ backgroundColor: template.primaryColor }}
                      ></div>
                      <div className="h-2 w-2/3 mx-auto bg-gray-300 rounded"></div>
                    </div>
                    <div className="p-3">
                      <div 
                        className="h-3 w-1/3 bg-gray-300 rounded mb-2 uppercase"
                        style={{ borderBottom: `1px solid ${template.primaryColor}` }}
                      ></div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-3"></div>
                      <div 
                        className="h-3 w-1/3 bg-gray-300 rounded mb-2 uppercase"
                        style={{ borderBottom: `1px solid ${template.primaryColor}` }}
                      ></div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                )}

                {template.id === "creative" && (
                  <div className="h-full w-full">
                    {/* Creative Template Preview */}
                    <div
                      className="h-12 w-full relative rounded-br-3xl"
                      style={{ backgroundColor: template.primaryColor }}
                    >
                      <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full" 
                        style={{ backgroundColor: template.accent, transform: 'translate(25%, 25%)' }}></div>
                    </div>
                    <div className="flex p-2 relative">
                      <div className="w-2/3 p-2">
                        <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-3"></div>
                      </div>
                      <div
                        className="w-1/3 p-2 rounded-tl-3xl"
                        style={{ backgroundColor: template.secondaryColor }}
                      >
                        <div className="w-full h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="absolute top-0 left-4 w-5 h-5 rounded-full" 
                        style={{ backgroundColor: template.accent }}></div>
                    </div>
                  </div>
                )}
              </div>
              <span className="font-medium" style={{ fontFamily: template.fontFamily }}>
                {template.name}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TemplateSelector;
