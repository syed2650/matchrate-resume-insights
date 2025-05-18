
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TemplateSelectorProps {
  templates: any[];
  selectedTemplate: string;
  onSelectTemplate: (templateName: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  return (
    <div className="template-selector">
      <h3 className="font-medium text-lg text-slate-900 mb-4">Choose Template</h3>
      <RadioGroup 
        value={selectedTemplate} 
        onValueChange={onSelectTemplate} 
        className="grid grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id}>
            <RadioGroupItem 
              value={template.name} 
              id={`template-${template.name}`}
              className="peer sr-only"
            />
            <Label 
              htmlFor={`template-${template.name}`}
              className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div 
                className="template-preview w-full h-32" 
                style={{ borderColor: template.primaryColor || '#ccc' }}
              >
                {/* Modern Template Preview */}
                {template.name === 'Modern' && (
                  <div className="preview-content preview-modern">
                    <div className="preview-header" style={{ backgroundColor: template.primaryColor }}>
                      <div className="preview-name">NAME</div>
                    </div>
                    <div className="preview-body">
                      <div className="preview-left-column">
                        <div className="preview-section"></div>
                        <div className="preview-section"></div>
                      </div>
                      <div className="preview-right-column" style={{ backgroundColor: template.secondaryColor }}>
                        <div className="preview-section"></div>
                        <div className="preview-section"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Professional Template Preview */}
                {template.name === 'Professional' && (
                  <div className="preview-content preview-professional">
                    <div className="preview-header">
                      <div className="preview-name" style={{ color: template.primaryColor }}></div>
                    </div>
                    <div className="preview-section-title" style={{ backgroundColor: template.primaryColor }}></div>
                    <div className="preview-section"></div>
                    <div className="preview-section"></div>
                    <div className="preview-section-title" style={{ backgroundColor: template.primaryColor }}></div>
                    <div className="preview-section"></div>
                  </div>
                )}
                
                {/* Creative Template Preview */}
                {template.name === 'Creative' && (
                  <div className="preview-content preview-creative">
                    <div className="preview-header" style={{ backgroundColor: template.primaryColor }}>
                      <div className="preview-accent" style={{ backgroundColor: template.secondaryColor }}></div>
                    </div>
                    <div className="preview-body">
                      <div className="preview-section"></div>
                      <div className="preview-section"></div>
                      <div className="preview-accent" style={{ backgroundColor: template.secondaryColor }}></div>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-center text-sm font-medium">{template.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TemplateSelector;
