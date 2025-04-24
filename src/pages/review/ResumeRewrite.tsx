import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getATSScoreExplanation, getATSScoreDetail } from "./utils";
import { jsPDF } from "jspdf";
import {
  Document, Paragraph, TextRun, HeadingLevel, 
  AlignmentType, Packer, Table, TableRow, TableCell, TableBorders, BorderStyle,
  WidthType, UnderlineType, SectionType
} from "docx";

interface ResumeRewriteProps {
  rewrittenResume: any; // Can be string or object with multiple versions
  atsScores?: Record<string, number>;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ rewrittenResume, atsScores = {} }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>("startup");
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("");
  const [suggestedBulletPoints, setSuggestedBulletPoints] = useState<string[]>([]);
  
  useEffect(() => {
    if (!generatedTimestamp) {
      setGeneratedTimestamp(new Date().toLocaleString());
    }
  }, [rewrittenResume, generatedTimestamp]);
  
  useEffect(() => {
    if (rewrittenResume) {
      const extractBullets = (text: string): string[] => {
        const bulletPattern = /^(?:\*|\-)\s+(.+?)$/gm;
        const bullets: string[] = [];
        let match;
        
        while ((match = bulletPattern.exec(text)) !== null) {
          if (match[1]) bullets.push(match[1]);
        }
        
        return bullets.slice(0, 8);
      };
      
      const currentResumeText = hasMultipleVersions 
        ? rewrittenResume[activeVersion] || ''
        : (typeof rewrittenResume === 'string' ? rewrittenResume : '');
      
      setSuggestedBulletPoints(extractBullets(currentResumeText));
    }
  }, [rewrittenResume, activeVersion]);
  
  const hasMultipleVersions = typeof rewrittenResume === 'object' && 
                             rewrittenResume !== null &&
                             !Array.isArray(rewrittenResume) &&
                             Object.keys(rewrittenResume).length > 1;
  
  const currentResume = hasMultipleVersions 
    ? rewrittenResume[activeVersion] || ''
    : typeof rewrittenResume === 'string' ? rewrittenResume : '';

  const currentAtsScore = hasMultipleVersions
    ? atsScores[activeVersion] || 0
    : (typeof atsScores === 'object' && Object.values(atsScores)[0]) || 0;
    
  const roleSummaryMatch = currentResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/);
  const roleSummary = roleSummaryMatch ? roleSummaryMatch[1].trim() : "";
  
  const atsScoreExplanation = getATSScoreExplanation(currentAtsScore);
  const atsScoreDetail = getATSScoreDetail(currentAtsScore);

  const handleCopyToClipboard = () => {
    if (currentResume) {
      navigator.clipboard.writeText(currentResume).then(() => {
        setCopied(true);
        toast({
          title: "Success",
          description: "Resume copied to clipboard",
        });
        
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

  const parseResumeContent = (content: string) => {
    const sections: {[key: string]: string[]} = {};
    let currentSection = "header";
    sections[currentSection] = [];
    
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.match(/^#{1,2}\s+/) || line.match(/^[A-Z\s]{5,}$/)) {
        currentSection = line.replace(/^#{1,2}\s+/, '').trim();
        sections[currentSection] = [];
      } else if (line.trim()) {
        sections[currentSection].push(line);
      }
    });
    
    return sections;
  };
  
  const handleDownloadPDF = () => {
    if (!currentResume) return;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });
    
    const margin = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    
    const firstLine = currentResume.split('\n')[0].replace('#', '').trim();
    doc.text(firstLine, margin, margin);
    
    let yPos = margin + 30;
    if (roleSummary) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text(`Tailored for: ${roleSummary}`, margin, yPos);
      yPos += 25;
    }
    
    const sections = parseResumeContent(currentResume);
    doc.setFontSize(10);
    
    Object.keys(sections).forEach(sectionName => {
      if (sectionName === 'header') return;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(sectionName.toUpperCase(), margin, yPos);
      yPos += 18;
      
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos - 5, doc.internal.pageSize.width - margin, yPos - 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      sections[sectionName].forEach(line => {
        if (yPos > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPos = margin;
        }
        
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const bulletText = line.replace(/^[*-]\s/, '');
          doc.circle(margin + 3, yPos - 3, 1.5, 'F');
          doc.text(bulletText, margin + 10, yPos);
          yPos += 18;
        } else if (line.match(/^[A-Za-z ]+\s+\|\s+/)) {
          doc.setFont('helvetica', 'bold');
          doc.text(line, margin, yPos);
          doc.setFont('helvetica', 'normal');
          yPos += 18;
        } else {
          doc.text(line, margin, yPos);
          yPos += 18;
        }
      });
      
      yPos += 10;
    });
    
    const footerText = `ATS Score: ${currentAtsScore}/100 - Generated on ${generatedTimestamp}`;
    doc.text(footerText, margin, doc.internal.pageSize.height - 30);
    
    const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
    doc.save(`matchrate-optimized-resume${versionLabel}.pdf`);
    
    toast({
      title: "Success",
      description: "Resume downloaded as PDF",
    });
  };
  
  const handleDownloadDocx = () => {
    if (!currentResume) return;
    
    try {
      const sections = parseResumeContent(currentResume);
      
      const doc = new Document({
        sections: []
      });
      
      const documentSection = {
        properties: {},
        children: []
      };
      
      doc.addSection(documentSection);
      
      const firstSection = doc.sections[0];
      
      const name = currentResume.split('\n')[0].replace('#', '').trim();
      firstSection.addParagraph(
        new Paragraph({
          children: [
            new TextRun({
              text: name,
              bold: true,
              size: 28,
            })
          ],
          spacing: { after: 200 }
        })
      );
      
      if (roleSummary) {
        firstSection.addParagraph(
          new Paragraph({
            children: [
              new TextRun({
                text: `Tailored for: ${roleSummary}`,
                italics: true,
                size: 22,
              })
            ],
            spacing: { after: 300 }
          })
        );
      }

      Object.keys(sections).forEach(sectionName => {
        if (sectionName === 'header') return;
        
        firstSection.addParagraph(
          new Paragraph({
            text: sectionName.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { after: 200 }
          })
        );
        
        sections[sectionName].forEach(line => {
          if (line.startsWith('* ') || line.startsWith('- ')) {
            const bulletText = line.replace(/^[*-]\s/, '');
            firstSection.addParagraph(
              new Paragraph({
                children: [new TextRun(bulletText)],
                bullet: { level: 0 },
                spacing: { after: 120 }
              })
            );
          } else if (line.match(/^[A-Za-z ]+\s+\|\s+/)) {
            firstSection.addParagraph(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true
                  })
                ],
                spacing: { after: 120 }
              })
            );
          } else {
            firstSection.addParagraph(
              new Paragraph({
                text: line,
                spacing: { after: 120 }
              })
            );
          }
        });
        
        firstSection.addParagraph(
          new Paragraph({ spacing: { after: 300 }})
        );
      });
      
      firstSection.addParagraph(
        new Paragraph({
          children: [
            new TextRun({
              text: `ATS Score: ${currentAtsScore}/100 - Generated on ${generatedTimestamp}`,
              size: 16,
              color: "666666",
            })
          ],
          spacing: { before: 300 }
        })
      );

      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const versionLabel = hasMultipleVersions ? `-${activeVersion}` : '';
        link.href = url;
        link.download = `matchrate-optimized-resume${versionLabel}.docx`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Resume downloaded as DOCX",
        });
      });
    } catch (error) {
      console.error("DOCX generation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate DOCX file. Please try again.",
        variant: "destructive"
      });
    }
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
              : "Resume Analysis"}
            {currentAtsScore > 0 && getAtsScoreBadge(currentAtsScore)}
          </h3>
          
          {roleSummary && (
            <div className="mt-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1 inline-block">
              {roleSummary}
            </div>
          )}

          {generatedTimestamp && (
            <div className="mt-1 text-xs text-slate-500">
              Generated on {generatedTimestamp}
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
            onClick={handleDownloadDocx}
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
      
      <div className="border-t pt-6 mt-6">
        <h4 className="font-bold text-lg text-slate-900 mb-3">Suggested Resume Upgrades</h4>
        <p className="text-sm text-slate-600 mb-4">
          These STAR-format bullet points are tailored to highlight your relevant skills and match the job requirements:
        </p>
        <ul className="space-y-3">
          {suggestedBulletPoints.length > 0 ? (
            suggestedBulletPoints.map((bullet, idx) => (
              <li key={idx} className="pl-6 relative text-slate-700">
                <span className="absolute top-0 left-0 text-blue-600">•</span>
                {bullet}
              </li>
            ))
          ) : (
            <li className="text-slate-500 italic">No suggested bullet points available.</li>
          )}
        </ul>
      </div>
      
      {currentAtsScore > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <h4 className="font-semibold text-blue-800">ATS Compatibility: {currentAtsScore}/100</h4>
            <Badge className="ml-2 bg-blue-200 text-blue-800 hover:bg-blue-300">
              🔒 Score locked until resume changes
            </Badge>
          </div>
          <p className="text-blue-700 text-sm">
            {atsScoreExplanation}
          </p>
          <p className="text-blue-600 text-xs mt-2">
            {atsScoreDetail}
          </p>
          {generatedTimestamp && (
            <div className="mt-3 text-xs text-blue-500 italic">
              Score generated on {generatedTimestamp}
            </div>
          )}
          <div className="mt-3 p-3 bg-white rounded border border-blue-100 text-xs text-slate-600">
            <p>
              <strong>About ATS Scores:</strong> AI analysis is based on your most recent inputs. ATS compatibility reflects structure, keywords, and formatting. Score won't change unless your resume does.
            </p>
          </div>
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
