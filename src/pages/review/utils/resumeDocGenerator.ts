import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType,
  UnderlineType,
  ImageRun,
  IPropertiesOptions,
  TableOfContents,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType,
  ExternalHyperlink
} from 'docx';
import { ResumeData, ResumeTemplate } from './resumeRewriter';

/**
 * Generate a DOCX document from resume data using the specified template
 * @param resumeData Resume data
 * @param template Template to use
 * @returns DOCX Document object
 */
export const generateResumeDocx = (resumeData: ResumeData, template: ResumeTemplate): Document => {
  // Define document properties
  const documentProperties: IPropertiesOptions = {
    title: `${resumeData.header.name} - Resume`,
    creator: "MatchRate Resume Builder",
    description: "Professional resume created with MatchRate",
    lastModifiedBy: "MatchRate",
  };

  // Select template-specific generator
  switch (template.id) {
    case 'modern':
      return generateModernDocx(resumeData, template, documentProperties);
    case 'professional':
      return generateProfessionalDocx(resumeData, template, documentProperties);
    case 'creative':
      return generateCreativeDocx(resumeData, template, documentProperties);
    default:
      return generateModernDocx(resumeData, template, documentProperties);
  }
};

/**
 * Generate a Modern template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateModernDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: IPropertiesOptions
): Document {
  // Set primary and secondary colors from template
  const primaryColor = template.primaryColor.replace('#', '');
  const secondaryColor = template.secondaryColor.replace('#', '');
  
  // Document styles
  const styles = {
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 120
          }
        }
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
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
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 28,
          bold: true,
          color: primaryColor,
          allCaps: template.sectionTitleCase === 'uppercase',
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          border: {
            bottom: {
              color: primaryColor,
              style: BorderStyle.SINGLE,
              size: 1,
            },
          },
        },
      },
      {
        id: 'JobTitle',
        name: 'Job Title',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 24,
          bold: true,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 60,
          },
        },
      },
      {
        id: 'JobCompany',
        name: 'Job Company',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          italic: true,
          color: '444444'
        },
        paragraph: {
          spacing: {
            after: 60,
          },
        },
      },
      {
        id: 'BulletList',
        name: 'Bullet List',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 80,
          },
          bullet: {
            level: 0
          }
        },
      },
    ],
  };

  // Create the document
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    styles,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Header with background color
          new Paragraph({
            text: resumeData.header.name,
            heading: HeadingLevel.HEADING_1,
            shading: {
              type: ShadingType.SOLID,
              color: primaryColor,
              fill: primaryColor,
            },
            spacing: {
              after: 200,
            },
          }),
          
          // Contact information
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
            children: [
              new TextRun({
                text: formatContactString(resumeData),
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
                        text: "PROFESSIONAL SUMMARY",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      new Paragraph({
                        text: resumeData.summary,
                        spacing: {
                          after: 240,
                        }
                      }),
                      
                      // Experience
                      new Paragraph({
                        text: "PROFESSIONAL EXPERIENCE",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      // Generate job entries
                      ...[].concat(...resumeData.experience.map((job, index) => {
                        const paragraphs = [
                          new Paragraph({
                            text: job.position || '',
                            style: 'JobTitle',
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: job.company || '',
                                size: 22,
                                font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
                              }),
                              new TextRun({
                                text: job.date ? `  |  ${job.date}` : '',
                                size: 22,
                                color: '666666',
                                font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
                              }),
                            ],
                            spacing: {
                              after: 120,
                            },
                          }),
                          
                          // Job bullets
                          ...(job.bullets || []).map((bullet) => 
                            new Paragraph({
                              text: bullet,
                              style: 'BulletList',
                            })
                          ),
                          
                          // Spacing after each job
                          new Paragraph({
                            text: "",
                            spacing: {
                              after: 240,
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
                      type: ShadingType.SOLID,
                      color: secondaryColor,
                      fill: secondaryColor,
                    },
                    margins: {
                      left: 200,
                      right: 200,
                      top: 200,
                    },
                    children: [
                      // Skills
                      new Paragraph({
                        text: "SKILLS",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      ...(resumeData.skills || []).map((skill) => 
                        new Paragraph({
                          text: `${skill.name}`,
                          bullet: {
                            level: 0,
                          },
                          spacing: {
                            after: 80,
                          },
                        })
                      ),
                      
                      // Spacing after skills
                      new Paragraph({
                        text: "",
                        spacing: {
                          after: 240,
                        },
                      }),
                      
                      // Education
                      new Paragraph({
                        text: "EDUCATION",
                        heading: HeadingLevel.HEADING_2,
                      }),
                      
                      ...[].concat(...(resumeData.education || []).map((edu) => [
                        new Paragraph({
                          text: edu.degree || '',
                          spacing: {
                            after: 60,
                          },
                          run: {
                            bold: true,
                          }
                        }),
                        new Paragraph({
                          text: edu.institution || '',
                          spacing: {
                            after: 60,
                          },
                        }),
                        edu.date ? new Paragraph({
                          text: edu.date,
                          spacing: {
                            after: 60,
                          },
                          run: {
                            color: '666666',
                          }
                        }) : new Paragraph({}),
                        ...(edu.details || []).map((detail) => 
                          new Paragraph({
                            text: detail,
                            bullet: {
                              level: 0,
                            },
                            spacing: {
                              after: 60,
                            },
                          })
                        ),
                        // Spacing after education
                        new Paragraph({
                          text: "",
                          spacing: {
                            after: 240,
                          },
                        }),
                      ])),
                      
                      // Additional Information
                      resumeData.achievements && resumeData.achievements.length > 0 ? 
                        new Paragraph({
                          text: "ADDITIONAL INFORMATION",
                          heading: HeadingLevel.HEADING_2,
                        }) : new Paragraph({}),
                      
                      ...(resumeData.achievements || []).map((achievement) => 
                        new Paragraph({
                          text: achievement,
                          bullet: {
                            level: 0,
                          },
                          spacing: {
                            after: 80,
                          },
                        })
                      ),
                    ],
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
}

/**
 * Generate a Professional template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateProfessionalDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: IPropertiesOptions
): Document {
  // Set primary and secondary colors from template
  const primaryColor = template.primaryColor.replace('#', '');
  const secondaryColor = template.secondaryColor.replace('#', '');
  
  // Create a simpler, one-column document for Professional template
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 24,
            color: '333333'
          },
          paragraph: {
            spacing: {
              after: 120
            }
          }
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 36,
            bold: true,
            color: primaryColor
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 28,
            bold: true,
            color: primaryColor,
            allCaps: true,
          },
          paragraph: {
            spacing: {
              before: 280,
              after: 160,
            },
            border: {
              bottom: {
                color: primaryColor,
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
          },
        },
        {
          id: 'BulletList',
          name: 'Bullet List',
          basedOn: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 24,
            color: '333333'
          },
          paragraph: {
            spacing: {
              after: 100,
            },
            bullet: {
              level: 0
            }
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1008,
              right: 1008,
              bottom: 1008,
              left: 1008,
            },
          },
        },
        children: [
          // Header - Name
          new Paragraph({
            text: resumeData.header.name,
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Contact information
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
            children: [
              new TextRun({
                text: formatContactString(resumeData),
                size: 22,
                color: '666666',
              }),
            ],
          }),
          
          // Summary
          new Paragraph({
            text: "SUMMARY",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: resumeData.summary,
            spacing: {
              after: 240,
            }
          }),
          
          // Experience
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_2,
          }),
          
          // Generate job entries
          ...[].concat(...resumeData.experience.map((job) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: job.position || '',
                  size: 26,
                  bold: true,
                }),
              ],
              spacing: {
                after: 60,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: job.company || '',
                  size: 24,
                  italic: true,
                }),
                new TextRun({
                  text: job.date ? `  |  ${job.date}` : '',
                  size: 24,
                  color: '666666',
                }),
              ],
              spacing: {
                after: 120,
              },
            }),
            
            // Job bullets
            ...(job.bullets || []).map((bullet) => 
              new Paragraph({
                text: bullet,
                style: 'BulletList',
              })
            ),
            
            // Spacing after each job
            new Paragraph({
              text: "",
              spacing: {
                after: 240,
              },
            }),
          ])),
          
          // Education
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_2,
          }),
          
          ...[].concat(...(resumeData.education || []).map((edu) => [
            new Paragraph({
              text: edu.degree || '',
              spacing: {
                after: 60,
              },
              children: [
                new TextRun({
                  text: edu.degree || '',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              text: edu.institution || '',
              spacing: {
                after: 60,
              },
            }),
            edu.date ? new Paragraph({
              text: edu.date,
              spacing: {
                after: 60,
              },
              children: [
                new TextRun({
                  text: edu.date,
                  color: '666666',
                  size: 24,
                }),
              ],
            }) : new Paragraph({}),
            
            // Education details
            ...(edu.details || []).map((detail) => 
              new Paragraph({
                text: detail,
                style: 'BulletList',
              })
            ),
            
            // Spacing after education
            new Paragraph({
              text: "",
              spacing: {
                after: 200,
              },
            }),
          ])),
          
          // Skills
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            children: resumeData.skills.map((skill, index, arr) => 
              new TextRun({
                text: `${skill.name}${index < arr.length - 1 ? ' • ' : ''}`,
                size: 24,
              })
            ),
            spacing: {
              after: 240,
            }
          }),
          
          // Additional Information (if present)
          resumeData.achievements && resumeData.achievements.length > 0 ? 
            new Paragraph({
              text: "ADDITIONAL INFORMATION",
              heading: HeadingLevel.HEADING_2,
            }) : new Paragraph({}),
          
          ...(resumeData.achievements || []).map((achievement) => 
            new Paragraph({
              text: achievement,
              style: 'BulletList',
            })
          ),
        ],
      },
    ],
  });
  
  return document;
}

/**
 * Generate a Creative template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateCreativeDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: IPropertiesOptions
): Document {
  // Set primary and secondary colors from template
  const primaryColor = template.primaryColor.replace('#', '');
  const secondaryColor = template.secondaryColor.replace('#', '');
  
  // Create a creative document with non-standard layouts and colors
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 24,
            color: '333333'
          },
          paragraph: {
            spacing: {
              after: 120,
              line: 360, // Line spacing
            }
          }
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 40,
            bold: true,
            color: 'FFFFFF'
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240,
              line: 360,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 32,
            bold: true,
            color: primaryColor,
          },
          paragraph: {
            spacing: {
              before: 360,
              after: 180,
              line: 360,
            },
            indent: {
              left: 720, // Indent to create space for color bar
            },
            border: {
              left: {
                color: primaryColor,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          },
        },
        {
          id: 'JobTitle',
          name: 'Job Title',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 26,
            bold: true,
            color: primaryColor
          },
          paragraph: {
            spacing: {
              after: 60,
              line: 360,
            },
          },
        },
        {
          id: 'JobCompany',
          name: 'Job Company',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 24,
            italic: true,
            color: '444444'
          },
          paragraph: {
            spacing: {
              after: 60,
              line: 360,
            },
          },
        },
        {
          id: 'BulletList',
          name: 'Bullet List',
          basedOn: 'Normal',
          quickFormat: true,
          run: {
            font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
            size: 24,
            color: '333333'
          },
          paragraph: {
            spacing: {
              after: 80,
              line: 360,
            },
            bullet: {
              level: 0
            }
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Header with background color
          new Paragraph({
            text: resumeData.header.name,
            heading: HeadingLevel.HEADING_1,
            shading: {
              type: ShadingType.SOLID,
              color: primaryColor,
              fill: primaryColor,
            },
            spacing: {
              after: 240,
            },
            border: {
              bottom: {
                color: secondaryColor,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          
          // Contact information
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
            children: [
              new TextRun({
                text: formatContactString(resumeData),
                size: 22,
                color: '666666',
              }),
            ],
          }),
          
          // Summary
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: resumeData.summary,
            spacing: {
              after: 240,
            }
          }),
          
          // Experience
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
          }),
          
          // Generate job entries
          ...[].concat(...resumeData.experience.map((job) => [
            new Paragraph({
              style: 'JobTitle',
              children: [
                new TextRun({
                  text: job.position || '',
                }),
              ],
            }),
            new Paragraph({
              style: 'JobCompany',
              children: [
                new TextRun({
                  text: job.company || '',
                }),
                new TextRun({
                  text: job.date ? `  |  ${job.date}` : '',
                  color: '666666',
                }),
              ],
            }),
            
            // Job bullets
            ...(job.bullets || []).map((bullet) => 
              new Paragraph({
                style: 'BulletList',
                text: bullet,
              })
            ),
            
            // Spacing after each job
            new Paragraph({
              text: "",
              spacing: {
                after: 240,
              },
            }),
          ])),
          
          // Skills
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
          }),
          
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
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    children: resumeData.skills.slice(0, Math.ceil(resumeData.skills.length / 2)).map((skill) => 
                      new Paragraph({
                        text: skill.name,
                        bullet: {
                          level: 0,
                        },
                        spacing: {
                          after: 80,
                        },
                      })
                    ),
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE,
                    },
                    children: resumeData.skills.slice(Math.ceil(resumeData.skills.length / 2)).map((skill) => 
                      new Paragraph({
                        text: skill.name,
                        bullet: {
                          level: 0,
                        },
                        spacing: {
                          after: 80,
                        },
                      })
                    ),
                  }),
                ],
              }),
            ],
          }),
          
          // Education
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
          }),
          
          ...[].concat(...(resumeData.education || []).map((edu) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree || '',
                  bold: true,
                  size: 26,
                }),
              ],
              spacing: {
                after: 60,
              },
            }),
            new Paragraph({
              text: edu.institution || '',
              spacing: {
                after: 60,
              },
            }),
            edu.date ? new Paragraph({
              children: [
                new TextRun({
                  text: edu.date,
                  color: '666666',
                  size: 22,
                }),
              ],
              spacing: {
                after: 60,
              },
            }) : new Paragraph({}),
            
            // Education details
            ...(edu.details || []).map((detail) => 
              new Paragraph({
                text: detail,
                bullet: {
                  level: 0,
                },
                spacing: {
                  after: 60,
                },
              })
            ),
            
            // Spacing after education
            new Paragraph({
              text: "",
              spacing: {
                after: 200,
              },
            }),
          ])),
          
          // Additional Information
          resumeData.achievements && resumeData.achievements.length > 0 ? 
            new Paragraph({
              text: "Additional Information",
              heading: HeadingLevel.HEADING_2,
            }) : new Paragraph({}),
          
          ...(resumeData.achievements || []).map((achievement) => 
            new Paragraph({
              text: achievement,
              bullet: {
                level: 0,
              },
              spacing: {
                after: 80,
              },
            })
          ),
        ],
      },
    ],
  });
  
  return document;
}

/**
 * Format contact information as a string
 * @param resumeData Resume data
 * @returns Formatted contact string
 */
function formatContactString(resumeData: ResumeData): string {
  const contactParts = [];
  
  if (resumeData.header.contact.location) {
    contactParts.push(resumeData.header.contact.location);
  }
  
  if (resumeData.header.contact.phone) {
    contactParts.push(resumeData.header.contact.phone);
  }
  
  if (resumeData.header.contact.email) {
    contactParts.push(resumeData.header.contact.email);
  }
  
  return contactParts.join(' | ');
}

export default generateResumeDocx;
