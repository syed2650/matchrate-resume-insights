
import { useState, useEffect } from "react";

interface AutosaveData {
  resume: string;
  jobDescription: string;
  jobUrl?: string;
  jobTitle?: string;
  lastSaved: number;
}

export const useResumeAutosave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save form data to session storage
  const saveFormData = (data: {
    resume: string;
    jobDescription: string;
    jobUrl?: string;
    jobTitle?: string;
  }) => {
    try {
      setIsSaving(true);
      
      const saveData: AutosaveData = {
        ...data,
        lastSaved: Date.now()
      };
      
      sessionStorage.setItem('matchrate_resume_analysis', JSON.stringify(saveData));
      
      setLastSaved(new Date());
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error saving form data:", error);
      setIsSaving(false);
      return false;
    }
  };

  // Load saved form data from session storage
  const loadFormData = (): {
    resume: string;
    jobDescription: string;
    jobUrl?: string;
    jobTitle?: string;
    lastSaved?: Date;
  } | null => {
    try {
      const savedData = sessionStorage.getItem('matchrate_resume_analysis');
      if (!savedData) return null;
      
      const parsedData: AutosaveData = JSON.parse(savedData);
      
      // Return the data with a proper Date object for lastSaved
      return {
        resume: parsedData.resume || "",
        jobDescription: parsedData.jobDescription || "",
        jobUrl: parsedData.jobUrl,
        jobTitle: parsedData.jobTitle,
        lastSaved: new Date(parsedData.lastSaved)
      };
    } catch (error) {
      console.error("Error loading form data:", error);
      return null;
    }
  };

  // Clear saved form data
  const clearSavedFormData = () => {
    try {
      sessionStorage.removeItem('matchrate_resume_analysis');
      setLastSaved(null);
      return true;
    } catch (error) {
      console.error("Error clearing form data:", error);
      return false;
    }
  };

  return {
    saveFormData,
    loadFormData,
    clearSavedFormData,
    isSaving,
    lastSaved
  };
};
