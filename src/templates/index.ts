
import { ResumeTemplate } from "../utils/resumeRewriter";
import modernTemplate from "./modern";
import professionalTemplate from "./professional";
import creativeTemplate from "./creative";

export const templates: ResumeTemplate[] = [
  modernTemplate,
  professionalTemplate,
  creativeTemplate
];

export const getTemplateById = (id: string): ResumeTemplate => {
  return templates.find(t => t.id === id) || templates[0];
};
