
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getATSScoreExplanation } from "./utils";
import { jsPDF } from "jspdf";

interface ResumeRewriteProps {
  rewrittenResume: any; // Can be string or object with multiple versions
  atsScores?: Record<string, number>;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ rewrittenResume, atsScores = {} }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>("startup");
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("");
  
  // Set timestamp when component mounts or when rewrittenResume changes
  useEffect(() => {
    setGeneratedTimestamp(new Date().toLocaleString());
  }, [rewrittenResume]);
  
  // Determine if rewrittenResume is an object with multiple versions or just a single string
  const hasMultipleVersions = typeof rewrittenResume === 'object' && 
                             rewrittenResume !== null &&
                             !Array.isArray(rewrittenResume) &&
                             Object.keys(rewrittenResume).length > 1;
  
  // Get the current version to display
  const currentResume = hasMultipleVersions 
    ? rewrittenResume[activeVersion] || ''
    : typeof rewrittenResume === 'string' ? rewrittenResume : '';

  // Get ATS score for current version
  const currentAtsScore = hasMultipleVersions
    ? atsScores[activeVersion] || 0
    : (typeof atsScores === 'object' && Object.values(atsScores)[0]) || 0;
    
  // Extract role summary if available
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";

  // Get ATS score explanation
  const atsScoreExplanation = getATSScoreExplanation(currentAtsScore);

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
  
  const handleDownloadPDF = () => {
    if (!currentResume) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Optimized Resume", 20, 20);
    
    // Add summary line if available
    if (roleSummary) {
      doc.setFontSize(12);
      doc.text(`Tailored for: ${roleSummary}`, 20, 30);
    }
    
    // Process markdown content
    const lines = currentResume.split('\n');
    let yPos = 40;
    
    lines.forEach(line => {
      // Check for page break
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Process headings (check for markdown headings or all caps)
      if (line.startsWith('#') || line.match(/^[A-Z\s]{5,}$/)) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        
        // Remove markdown heading syntax if present
        const headingText = line.replace(/^#+\s/, '');
        doc.text(headingText, 20, yPos);
        yPos += 7;
      } 
      // Process bullet points
      else if (line.startsWith('* ') || line.startsWith('- ')) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Add indentation and bullet point
        const bulletText = line.replace(/^[*-]\s/, '');
        doc.text('• ' + bulletText, 25, yPos);
        yPos += 5;
      } 
      // Regular text
      else if (line.trim() !== '') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(line, 20, yPos);
        yPos += 5;
      }
      // Line break for empty lines
      else {
        yPos += 3;
      }
    });
    
    // Add footer with ATS score
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`ATS Score: ${currentAtsScore}/100 - Generated on ${generatedTimestamp}`, 20, 280);
    
    const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
    doc.save(`matchrate-optimized-resume${versionLabel}.pdf`);
    
    toast({
      title: "Success",
      description: "Resume downloaded as PDF",
    });
  };
  
  const handleDownloadDoc = () => {
    if (!currentResume) return;
    
    // For plain text download (since true .docx generation would require a server component)
    const element = document.createElement("a");
    const file = new Blob([currentResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    
    const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
    element.download = `matchrate-resume${versionLabel}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Success",
      description: "Resume downloaded as text file (ready to paste into Word)",
    });
  };

  const getAtsScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-600 hover:bg-green-700 ml-2">ATS Score: {score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-amber-600 hover:bg-amber-700 ml-2">ATS Score: {score}</Badge>;
    } else {
      return <Badge className="bg-red-600 hover:bg-red-700 ml-2">ATS Score: {score}</Badge>;
    }
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
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center">
            {hasMultipleVersions 
              ? "Tailored Resume Versions" 
              : "Optimized Resume"}
            {currentAtsScore > 0 && getAtsScoreBadge(currentAtsScore)}
          </h3>
          
          {roleSummary && (
            <div className="mt-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 inline-block">
              {roleSummary}
            </div>
          )}

          {generatedTimestamp && (
            <div className="mt-1 text-xs text-slate-500">
              Last generated on {generatedTimestamp}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
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
            variant="outline" 
            onClick={handleDownloadDoc}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download .docx
          </Button>
          
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleDownloadPDF}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
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
            <TabsTrigger value="startup">
              Startup Version
              {atsScores["startup"] && (
                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {atsScores["startup"]}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="enterprise">
              Enterprise Version
              {atsScores["enterprise"] && (
                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {atsScores["enterprise"]}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="consulting">
              Consulting Version
              {atsScores["consulting"] && (
                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {atsScores["consulting"]}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="border rounded-xl p-6 bg-white shadow-md overflow-auto max-h-[600px]">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {currentResume}
        </pre>
      </div>
      
      {currentAtsScore > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <h4 className="font-semibold text-blue-800">ATS Compatibility: {currentAtsScore}/100</h4>
          </div>
          <p className="text-blue-700 text-sm">
            {atsScoreExplanation}
          </p>
        </div>
      )}
      
      {hasMultipleVersions && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-2">About This Version</h4>
          <p className="text-slate-700 text-sm">
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
