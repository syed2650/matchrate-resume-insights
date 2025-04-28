
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";


// Register font (use safe fonts)
Font.register({
  family: 'Calibri',
  src: 'https://fonts.gstatic.com/s/calibri/v1/cw.woff' // Optional: Otherwise defaults to standard
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica", // use Helvetica for now
    fontSize: 11,
    lineHeight: 1.6,
    color: "#222222"
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#1E293B",
    borderBottom: "1 solid #ccc",
    paddingBottom: 4,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerContact: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
    color: "#666"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold"
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 3,
  }
});

export interface ResumeData {
  name: string;
  contact: string;
  summary: string[];
  skills: string[];
  experiences: Array<{
    company: string;
    location: string;
    dates: string;
    title: string;
    bullets: string[];
  }>;
  education: string[];
}

// The ResumePdfTemplate component returns a Document component as its root element
const ResumePdfTemplate = ({ data, ...props }: { data: ResumeData } & DocumentProps) => (
  <Document {...props}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.headerName}>{data.name}</Text>
      <Text style={styles.headerContact}>{data.contact}</Text>

      {/* Summary */}
      <View>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        {data.summary.map((line, idx) => (
          <Text key={idx}>{line}</Text>
        ))}
      </View>

      {/* Skills */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Key Skills</Text>
        <View>
          {data.skills.map((skill, idx) => (
            <Text key={idx} style={styles.bulletPoint}>• {skill}</Text>
          ))}
        </View>
      </View>

      {/* Experience */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        {data.experiences.map((exp, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={styles.bold}>{exp.company} • {exp.location}</Text>
              <Text>{exp.dates}</Text>
            </View>
            <Text style={styles.bold}>{exp.title}</Text>
            {exp.bullets.map((b, i) => (
              <Text key={i} style={styles.bulletPoint}>• {b}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.education.map((edu, idx) => (
          <Text key={idx}>{edu}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default ResumePdfTemplate;
