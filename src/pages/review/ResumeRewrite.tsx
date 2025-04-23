
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeRewriteProps {
  rewrittenResume: any; // Can be string or object with multiple versions
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ rewrittenResume }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>("startup");
  
  // Determine if rewrittenResume is an object with multiple versions or just a single string
  const hasMultipleVersions = typeof rewrittenResume === 'object' && 
                             rewrittenResume !== null &&
                             !Array.isArray(rewrittenResume) &&
                             Object.keys(rewrittenResume).length > 1;
  
  // Get the current version to display
  const currentResume = hasMultipleVersions 
    ? rewrittenResume[activeVersion] || ''
    : typeof rewrittenResume === 'string' ? rewrittenResume : '';

  const handleCopyToClipboard = () => {
    if (currentResume) {
      navigator.clipboard.writeText(currentResume).then(() => {
        setCopied(true);
        toast({
          title: "Success",
          description: "Resume copied to clipboard",
        });
        
        // Reset copied status after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy resume to clipboard",
          variant: "destructive"
        });
      });
    }
  };
  
  const handleDownloadDoc = () => {
    // In reality, you would implement a proper .docx generation here
    // For now, we'll just simulate it with a text file download
    const element = document.createElement("a");
    const file = new Blob([currentResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `matchrate-resume-${hasMultipleVersions ? activeVersion : 'optimized'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Success",
      description: "Resume downloaded as text file",
    });
  };

  if (!rewrittenResume) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-600">No rewritten resume available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold text-slate-900">
          {hasMultipleVersions 
            ? "Tailored Resume Versions" 
            : "Optimized Resume"}
        </h3>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleDownloadDoc}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      {hasMultipleVersions && (
        <Tabs 
          value={activeVersion} 
          className="w-full"
          onValueChange={value => setActiveVersion(value)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="startup">Startup Version</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise Version</TabsTrigger>
            <TabsTrigger value="consulting">Consulting Version</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="border rounded-xl p-6 bg-white shadow-inner overflow-auto">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {currentResume}
        </pre>
      </div>
      
      {hasMultipleVersions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">About This Version</h4>
          <p className="text-blue-700">
            {activeVersion === 'startup' && 'Optimized for startup environments. Emphasizes versatility, hands-on execution, and cross-functional skills.'}
            {activeVersion === 'enterprise' && 'Tailored for enterprise roles. Highlights process knowledge, scalability expertise, and enterprise-level impact.'}
            {activeVersion === 'consulting' && 'Crafted for consulting positions. Focuses on client management, adaptability, and structured problem-solving.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeRewrite;
