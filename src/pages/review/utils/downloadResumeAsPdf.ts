
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { ResumeData } from "../components/ResumePdfTemplate";
import ResumePdfTemplate from "../pages/review/components/ResumePdfTemplate";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  bullet: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 3
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  }
});

// Create PDF Document component using React.createElement
const ResumePDF = ({ data }: { data: ResumeData }) => {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(Text, { style: styles.header }, data.name),
      React.createElement(Text, { style: { fontSize: 12, textAlign: 'center', marginBottom: 20 } }, data.contact),
      
      // Summary
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.heading }, "PROFESSIONAL SUMMARY"),
        ...data.summary.map((line, i) =>
          React.createElement(Text, { key: i, style: styles.text }, line)
        )
      ),
      
      // Skills
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.heading }, "KEY SKILLS"),
        ...data.skills.map((skill, i) =>
          React.createElement(Text, { key: i, style: styles.bullet }, `• ${skill}`)
        )
      ),
      
      // Experience
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.heading }, "PROFESSIONAL EXPERIENCE"),
        ...data.experiences.map((exp, i) =>
          React.createElement(
            View,
            { key: i, style: { marginBottom: 15 } },
            React.createElement(
              View,
              { style: styles.row },
              React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold' } }, exp.company),
              React.createElement(Text, { style: { fontSize: 12 } }, exp.dates)
            ),
            React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', marginBottom: 5 } }, exp.title),
            ...exp.bullets.map((bullet, j) =>
              React.createElement(Text, { key: j, style: styles.bullet }, `• ${bullet}`)
            )
          )
        )
      ),
      
      // Education
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.heading }, "EDUCATION"),
        ...data.education.map((edu, i) =>
          React.createElement(Text, { key: i, style: styles.text }, edu)
        )
      )
    )
  );
};

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Fixed: We use React.createElement instead of JSX
    const pdfDocument = React.createElement(ResumePDF, { data: resumeData });
    const blob = await pdf(<ResumePdfTemplate data={resumeData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-ready-resume.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again later or use DOCX download instead.");
  }
}
