import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from "@react-pdf/renderer";

// Register Calibri font properly
Font.register({
  family: "Calibri",
  fonts: [
    { src: "https://fonts.gstatic.com/s/calibri/v1/cw.woff", fontWeight: "normal" },
    { src: "https://fonts.gstatic.com/s/calibri/v1/cwbd.woff", fontWeight: "bold" }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Calibri",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#222"
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#1E293B",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingBottom: 4,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4
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

const ResumePdfTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.headerName}>{data.name}</Text>
      <Text style={styles.headerContact}>{data.contact}</Text>

      {/* Professional Summary */}
      <View>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        {data.summary.map((line, idx) => (
          <Text key={idx}>{line}</Text>
        ))}
      </View>

      {/* Key Skills */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Key Skills</Text>
        <View>
          {data.skills.map((skill, idx) => (
            <Text key={idx} style={styles.bulletPoint}>• {skill}</Text>
          ))}
        </View>
      </View>

      {/* Professional Experience */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        {data.experiences.map((exp, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
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
