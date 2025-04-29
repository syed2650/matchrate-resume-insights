import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowUp } from "lucide-react";
import { getATSScoreFromCache, canUseRewrite, trackRewriteUsage } from "./utils";
import { useResumeVersion } from "./hooks/useResumeVersion";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { ExportInfo } from "./components/ExportInfo";
import ResumeHeader from "./components/ResumeHeader";
import ResumeContent from "./components/ResumeContent";
import UpgradeBanner from "./components/UpgradeBanner";
import { Progress } from "@/components/ui/progress";
import { parseResumeIntoData } from "./utils/parseResumeIntoData";

interface ResumeRewriteProps {
  rewrittenResume: any;
  atsScores?: Record<string, number>;
  scoreHash?: string | null;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  originalResume?: string;
  jobDescription?: string;
  originalATSScore?: number;
}

const formatResumeContent = (content: string): string => {
  if (!content) return "";
  try {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^(#+\s*)(.*?)$/gm, (_, hash, title) => `${hash}${title.toUpperCase()}`)
      .replace(/^\s*-\s+/gm, '• ')
      .replace(/^---$/gm, '--------------------')
      .replace(/^Optimized Resume(\n|$)/g, '')
      .replace(/^This resume is optimized for(?: a)?:? (.*?)(\n|$)/g, '');
  } catch (error) {
    console.error("Error formatting resume content:", error);
    return content || "";
  }
};

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ 
  rewrittenResume, 
  atsScores = {},
  scoreHash = null,
  jobContext,
  originalResume,
  jobDescription,
  originalATSScore = 0
}) => {
  const { toast } = useToast();
  const [stableAtsScores, setStableAtsScores] = useState<Record<string, number>>(atsScores);
  const [canRewrite, setCanRewrite] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { currentResume: rawResume, generatedTimestamp } = useResumeVersion({ rewrittenResume, activeVersion: "general" });

  const currentResume = formatResumeContent(rawResume);

  useEffect(() => {
    if (scoreHash) {
      const cachedScore = getATSScoreFromCache(scoreHash);
      if (cachedScore) setStableAtsScores(cachedScore.scores);
      else if (Object.keys(atsScores).length > 0) setStableAtsScores(atsScores);
    } else if (Object.keys(atsScores).length > 0) setStableAtsScores(atsScores);
    setCanRewrite(canUseRewrite());
  }, [scoreHash, atsScores]);

  const currentAtsScore = (typeof stableAtsScores === 'object' && Object.values(stableAtsScores)[0]) || 0;
  const scoreDifference = currentAtsScore - originalATSScore;

  const extractRoleSummary = () => {
    if (!rawResume) return "";
    const match = rawResume.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/) ||
                  rawResume.match(/Optimized for(?: a)?:? (.*?)(\n|$)/);
    return match ? match[1].trim() : "";
  };

  const roleSummary = extractRoleSummary();
  const isInterviewReady = currentAtsScore >= 75;

  const handleCopyToClipboard = () => {
    if (!canRewrite || !currentResume) {
      toast({ title: "Error", description: "No resume content available to copy", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(currentResume);
    trackRewriteUsage();
    toast({ title: "Success", description: "Resume copied to clipboard" });
  };

  const generateSimpleDocx = async (content: string) => {
    if (!content) return null;
    
    try {
      const resumeData = parseResumeIntoData(content);
      if (!resumeData) {
        throw new Error("Could not parse resume data");
      }
      
      // Define constants for document styling
      const FONT = { main: "Calibri" };
      const SPACING = {
        sectionSpace: 300,
        headingAfter: 120,
        betweenParagraphs: 100,
      };
      
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720, // 0.5 inches in twips
                  right: 1008, // 0.7 inches in twips
                  bottom: 720, // 0.5 inches in twips
                  left: 1008, // 0.7 inches in twips
                },
              },
            },
            children: [
              // Name - centered
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.name.toUpperCase(),
                    bold: true,
                    size: 28,
                    font: FONT.main,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
              }),
              
              // Contact Info - centered below name
              (() => {
                const contactParts = resumeData.contact.split('|').map(part => part.trim());
                return new Paragraph({
                  children: contactParts.map((part, i) => [
                    new TextRun({
                      text: part,
                      size: 20,
                      font: FONT.main,
                    }),
                    i < contactParts.length - 1 ? new TextRun({ text: " | ", size: 20, font: FONT.main }) : new TextRun({ text: "" })
                  ]).flat(),
                  alignment: AlignmentType.CENTER,
                  spacing: { after: SPACING.sectionSpace },
                });
              })(),
              
              // Add a horizontal line separator
              new Table({
                width: { size: 100, type: "pct" },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [new TableRow({
                  children: [new TableCell({
                    children: [new Paragraph({ spacing: { after: 0 } })],
                  })],
                })],
              }),
              
              // Space after horizontal line
              new Paragraph({
                spacing: { after: SPACING.sectionSpace },
              }),
              
              // Summary Section - Bold heading
              new Paragraph({
                children: [
                  new TextRun({
                    text: "SUMMARY",
                    bold: true,
                    size: 22,
                    font: FONT.main,
                    underline: {},
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { after: SPACING.headingAfter },
              }),
              
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.summary.join(" "),
                    font: FONT.main,
                    size: 22,
                  }),
                ],
                spacing: { after: SPACING.sectionSpace },
              }),
              
              // Professional Experience - Bold heading
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROFESSIONAL EXPERIENCE",
                    bold: true,
                    size: 22,
                    font: FONT.main,
                    underline: {},
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { after: SPACING.headingAfter },
              }),
              
              // Experience entries
              ...resumeData.experiences.flatMap((exp) => [
                // Company and role in left, dates in extreme right
                new Table({
                  width: { size: 100, type: "pct" },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 70, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: exp.company.split('•')[0].trim(), // Only take company name, remove location
                                  bold: true, // Make company name bold
                                  size: 22,
                                  font: FONT.main,
                                }),
                              ],
                            }),
                          ],
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        }),
                        new TableCell({
                          width: { size: 30, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              children: [
                                new TextRun({
                                  text: exp.dates,
                                  bold: true, // Make dates bold
                                  size: 22,
                                  font: FONT.main,
                                }),
                              ],
                            }),
                          ],
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        }),
                      ],
                    }),
                    // Job title in a separate row
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 100, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: exp.title,
                                  bold: true, // Make job title bold
                                  size: 22,
                                  font: FONT.main,
                                }),
                              ],
                              spacing: { after: 80 },
                            }),
                          ],
                          columnSpan: 2,
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                ...exp.bullets.map((bullet) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "• ",
                        size: 22,
                        font: FONT.main,
                      }),
                      new TextRun({
                        text: bullet,
                        size: 22,
                        font: FONT.main,
                      }),
                    ],
                    indent: { left: 360 },
                    spacing: { after: SPACING.betweenParagraphs, line: 360 },
                  })
                ),
                new Paragraph({ spacing: { after: SPACING.betweenParagraphs } }),
              ]),
              
              // Key Skills - Bold heading
              new Paragraph({
                children: [
                  new TextRun({
                    text: "KEY SKILLS",
                    bold: true,
                    size: 22,
                    font: FONT.main,
                    underline: {},
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { after: SPACING.headingAfter },
              }),
              ...resumeData.skills.map((skill) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "• ",
                      size: 22,
                      font: FONT.main,
                    }),
                    new TextRun({
                      text: skill,
                      size: 22, 
                      font: FONT.main,
                    }),
                  ],
                  indent: { left: 360 },
                  spacing: { after: SPACING.betweenParagraphs, line: 360 },
                })
              ),
              new Paragraph({ spacing: { after: SPACING.sectionSpace } }),
              
              // Education - Bold heading
              new Paragraph({
                children: [
                  new TextRun({
                    text: "EDUCATION",
                    bold: true,
                    size: 22,
                    font: FONT.main,
                    underline: {},
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { after: SPACING.headingAfter },
              }),
              ...resumeData.education.flatMap((edu) => {
                // Parse education entry
                const parts = edu.split('|');
                const degree = parts[0] ? parts[0].trim() : '';
                
                // Extract institution and additional info
                let institution = '';
                let country = '';
                let year = '';
                
                if (parts.length > 1) {
                  const institutionParts = parts[1].trim().split('•');
                  institution = institutionParts[0] ? institutionParts[0].trim() : '';
                  
                  if (institutionParts.length > 1) {
                    const locationParts = institutionParts[1].trim().split('–');
                    country = locationParts[0] ? locationParts[0].trim() : '';
                    year = locationParts.length > 1 ? locationParts[1].trim() : '';
                  }
                }
                
                return [
                  // Degree - Bold
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: degree,
                        bold: true,
                        size: 22,
                        font: FONT.main,
                      }),
                    ],
                    spacing: { after: 80 },
                  }),
                  // Institution
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: institution,
                        size: 22,
                        font: FONT.main,
                      }),
                    ],
                    spacing: { after: 80 },
                  }),
                  // Country on next line
                  country && new Paragraph({
                    children: [
                      new TextRun({
                        text: country,
                        size: 22,
                        font: FONT.main,
                        italics: true,
                      }),
                    ],
                    spacing: { after: 80 },
                  }),
                  // Year on next line after country
                  year && new Paragraph({
                    children: [
                      new TextRun({
                        text: year,
                        bold: true, // Make year bold
                        size: 22,
                        font: FONT.main,
                      }),
                    ],
                    spacing: { after: SPACING.sectionSpace },
                  }),
                ];
              }),
              
              // Recognition section if available - Bold heading
              ...(resumeData.recognition && resumeData.recognition.length > 0
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "RECOGNITION",
                          bold: true,
                          size: 22,
                          font: FONT.main,
                          underline: {},
                        }),
                      ],
                      heading: HeadingLevel.HEADING_2,
                      spacing: { after: SPACING.headingAfter },
                    }),
                    ...resumeData.recognition.map((item) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "• ",
                            size: 22,
                            font: FONT.main,
                          }),
                          new TextRun({
                            text: item,
                            size: 22,
                            font: FONT.main,
                          }),
                        ],
                        indent: { left: 360 },
                        spacing: { after: SPACING.betweenParagraphs, line: 360 },
                      })
                    ),
                  ]
                : []),
            ],
          },
        ],
      });
      
      return await Packer.toBlob(doc);
    } catch (error) {
      console.error("Error generating enhanced DOCX:", error);
      // Fallback to simple document creation if parsing fails
      try {
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: content,
                spacing: { line: 360 }
              })
            ]
          }]
        });
        return await Packer.toBlob(doc);
      } catch (fallbackError) {
        console.error("Fallback document generation failed:", fallbackError);
        return null;
      }
    }
  };

  const handleDownloadDocx = async () => {
    if (!canRewrite || !currentResume) {
      toast({ title: "Error", description: "No resume content available to download", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    try {
      const docBlob = await generateSimpleDocx(currentResume);
      if (!docBlob) {
        throw new Error("Failed to generate document");
      }
      
      // Create a download link
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement("a");
      a.href = url;
      
      // Set filename - with date and role if available
      const dateStr = new Date().toISOString().split('T')[0];
      const roleStr = roleSummary ? `-${roleSummary.replace(/\s+/g, '-')}` : '';
      a.download = `optimized-resume${roleStr}-${dateStr}.docx`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      trackRewriteUsage();
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({ title: "Error", description: "Failed to download resume", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!rewrittenResume) {
    return <div className="py-8 text-center"><p className="text-slate-600">No rewritten resume available.</p></div>;
  }

  return (
    <div className="space-y-6">
      {!canRewrite && <UpgradeBanner feature="resume rewriting" limit="15 rewrites per month" />}
      <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <h3 className="text-lg font-semibold text-green-800">Resume Successfully Optimized</h3>
        </div>
        <p className="text-green-700 mb-4">Your resume has been rewritten to improve your chances of getting an interview.</p>
      </div>
      <ResumeHeader
        currentAtsScore={currentAtsScore}
        roleSummary={roleSummary}
        generatedTimestamp={generatedTimestamp}
        isInterviewReady={isInterviewReady}
        onCopy={handleCopyToClipboard}
        onDownload={handleDownloadDocx}
        isPremiumLocked={!canRewrite}
      />
      {isProcessing && <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg"><h4 className="text-blue-800 font-medium mb-2">Processing Your Resume</h4><Progress value={50} className="h-2 mb-2" /><p className="text-blue-700 text-sm">Please wait while we prepare your document...</p></div>}
      <ResumeContent currentResume={currentResume} jobContext={jobContext} isPremiumBlurred={!canRewrite} />
      {canRewrite ? <ExportInfo /> : <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg"><h3 className="font-medium text-amber-800">Premium Feature</h3><p className="text-sm text-amber-700 mt-1">Resume rewriting is available on our paid plan with 15 rewrites per month. Upgrade to access this feature.</p></div>}
    </div>
  );
};

export default ResumeRewrite;
