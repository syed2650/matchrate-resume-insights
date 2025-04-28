
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { ResumeData } from "../components/ResumePdfTemplate";

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

// Create PDF Document
const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>{data.name}</Text>
      <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>{data.contact}</Text>
      
      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.heading}>PROFESSIONAL SUMMARY</Text>
        {data.summary.map((line, i) => (
          <Text key={i} style={styles.text}>{line}</Text>
        ))}
      </View>
      
      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.heading}>KEY SKILLS</Text>
        {data.skills.map((skill, i) => (
          <Text key={i} style={styles.bullet}>• {skill}</Text>
        ))}
      </View>
      
      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.heading}>PROFESSIONAL EXPERIENCE</Text>
        {data.experiences.map((exp, i) => (
          <View key={i} style={{ marginBottom: 15 }}>
            <View style={styles.row}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{exp.company}</Text>
              <Text style={{ fontSize: 12 }}>{exp.dates}</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 5 }}>{exp.title}</Text>
            {exp.bullets.map((bullet, j) => (
              <Text key={j} style={styles.bullet}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>
      
      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.heading}>EDUCATION</Text>
        {data.education.map((edu, i) => (
          <Text key={i} style={styles.text}>{edu}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    const blob = await pdf(<ResumePDF data={resumeData} />).toBlob();
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
