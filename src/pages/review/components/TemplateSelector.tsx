import React from 'react';
import { ResumeTemplate, resumeTemplates } from '@/utils/resumeRewriter';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

/**
 * Template selector component for choosing resume templates
 */
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Choose Template</h3>
      <div className="template-selector">
        {resumeTemplates.map((template) => (
          <div
            key={template.id}
            className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="template-preview">
              {template.id === 'modern' && (
                <div className="template-preview modern">
                  <div 
                    className="preview-header"
                    style={{ backgroundColor: template.primaryColor }}
                  ></div>
                  <div className="preview-content">
                    <div className="preview-main">
                      <div className="preview-section"></div>
                      <div className="preview-section" style={{ width: '80%' }}></div>
                      <div className="preview-section" style={{ width: '60%' }}></div>
                    </div>
                    <div 
                      className="preview-sidebar"
                      style={{ backgroundColor: template.secondaryColor }}
                    >
                      <div className="preview-section"></div>
                      <div className="preview-section" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {template.id === 'professional' && (
                <div className="template-preview professional">
                  <div 
                    className="preview-header"
                    style={{ borderBottomColor: template.primaryColor }}
                  ></div>
                  <div className="preview-content">
                    <div 
                      className="preview-section-title"
                      style={{ backgroundColor: template.primaryColor }}
                    ></div>
                    <div className="preview-section"></div>
                    <div className="preview-section" style={{ width: '80%' }}></div>
                    <div 
                      className="preview-section-title"
                      style={{ backgroundColor: template.primaryColor }}
                    ></div>
                    <div className="preview-section"></div>
                  </div>
                </div>
              )}
              
              {template.id === 'creative' && (
                <div className="template-preview creative">
                  <div 
                    className="preview-header"
                    style={{ backgroundColor: template.primaryColor }}
                  >
                    <div 
                      className="preview-accent"
                      style={{ backgroundColor: template.secondaryColor }}
                    ></div>
                  </div>
                  <div className="preview-content">
                    <div 
                      className="preview-section-title"
                      style={{ backgroundColor: template.primaryColor }}
                    ></div>
                    <div className="preview-section"></div>
                    <div className="preview-section" style={{ width: '70%' }}></div>
                    <div 
                      className="preview-accent"
                      style={{ backgroundColor: template.secondaryColor }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="template-name">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
