
import { Document, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';

export const generateModernDocx = (resumeData: any, template: any) => {
  const document = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            font: 'Open Sans',
            size: 22,
            color: '333333'
          },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Open Sans',
            size: 36,
            bold: true,
            color: 'FFFFFF'
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Open Sans',
            size: 28,
            bold: true,
            color: '2D74FF',
            allCaps: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
            border: {
              bottom: {
                color: '2D74FF',
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: [
          // Header with background color
          new Paragraph({
            text: resumeData.name,
            heading: HeadingLevel.HEADING_1,
            shading: {
              fill: '2D74FF',
            },
          }),
          
          // Contact information
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${resumeData.location} • ${resumeData.phone} • ${resumeData.email}`,
                size: 20,
                color: '666666',
              }),
            ],
          }),
          
          // Two column layout using tables
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  // Main column (70%)
                  new TableCell({
                    width: {
                      size: 70,
                      type: WidthType.PERCENTAGE,
                    },
                    margins: {
                      left: 200,
                      right: 200,
                    },
                    children: [
                      // Summary
                      new Paragraph({
                        text: "SUMMARY",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      new Paragraph({
                        text: resumeData.summary,
                      }),
                      
                      // Experience
                      new Paragraph({
                        text: "PROFESSIONAL EXPERIENCE",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      // Generate job entries
                      ...[].concat(...resumeData.experience.map((job: any) => {
                        const paragraphs = [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: job.title,
                                bold: true,
                                size: 24,
                              }),
                              new TextRun({
                                text: ` | ${job.company}`,
                                italics: true,
                                size: 24,
                              }),
                            ],
                          }),
                          new Paragraph({
                            text: job.date,
                            alignment: AlignmentType.RIGHT,
                            spacing: {
                              after: 100,
                            },
                          }),
                          
                          // Job bullets
                          ...job.bullets.map((bullet: string) => 
                            new Paragraph({
                              text: bullet,
                              bullet: {
                                level: 0,
                              },
                              spacing: {
                                after: 80,
                              },
                            })
                          ),
                          
                          // Spacing after each job
                          new Paragraph({
                            text: "",
                            spacing: {
                              after: 200,
                            },
                          }),
                        ];
                        
                        return paragraphs;
                      })),
                    ],
                  }),
                  
                  // Sidebar column (30%)
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    shading: {
                      fill: "E6F0FF",
                    },
                    margins: {
                      left: 200,
                      right: 200,
                    },
                    children: [
                      // Skills
                      new Paragraph({
                        text: "SKILLS",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      ...resumeData.skills.map((skill: any) => 
                        new Paragraph({
                          text: skill.name || skill,
                          spacing: {
                            after: 100,
                          },
                        })
                      ),
                      
                      // Education
                      new Paragraph({
                        text: "EDUCATION",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      ...resumeData.education.map((edu: any) => [
                        new Paragraph({
                          text: edu.degree,
                          // Remove the 'bold' property that was causing the TypeScript error
                        }),
                        new Paragraph({
                          text: edu.institution,
                        }),
                        new Paragraph({
                          text: edu.date,
                        }),
                        edu.gpa ? new Paragraph({
                          text: `CGPA: ${edu.gpa}`,
                          spacing: {
                            after: 200,
                          },
                        }) : null,
                      ].filter(Boolean)),
                      
                      // Awards
                      resumeData.awards && resumeData.awards.length > 0 ? 
                        new Paragraph({
                          text: "ADDITIONAL INFORMATION",
                          heading: HeadingLevel.HEADING_2,
                        }) : null,
                      
                      ...(resumeData.awards || []).map((award: string) => 
                        new Paragraph({
                          text: award,
                          spacing: {
                            after: 80,
                          },
                        })
                      ),
                    ].filter(Boolean),
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });
  
  return document;
};
