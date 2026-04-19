export type ResumeExperience = {
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  school: string;
  location?: string;
  startYear?: string;
  endYear?: string;
};

export type FinalResume = {
  fullName: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  targetTitle?: string;
  summary?: string;
  experience: ResumeExperience[];
  skills: string[];
  education: ResumeEducation[];
};

interface Props {
  data: FinalResume;
}

export function ResumeTemplate({ data }: Props) {
  const contactItems = [data.email, data.phone, data.linkedin, data.location].filter(
    Boolean,
  ) as string[];

  return (
    <div className="resume-page">
      <div className="r-header">
        <h1 className="r-name">{data.fullName}</h1>
        {contactItems.length > 0 && (
          <div className="r-contact">
            {contactItems.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        )}
      </div>

      <hr className="r-divider" />

      {data.targetTitle && <p className="r-target-title">{data.targetTitle}</p>}

      {data.summary && <p className="r-summary">{data.summary}</p>}

      {data.experience?.length > 0 && (
        <section className="r-section">
          <h2 className="r-section-title">Work Experience</h2>
          {data.experience.map((role, i) => (
            <div className="r-role" key={i}>
              <div className="r-role-header">
                <span className="r-company">{role.company}</span>
                <span className="r-dates">
                  {role.startDate} {role.startDate && role.endDate ? "–" : ""}{" "}
                  {role.endDate}
                </span>
              </div>
              <p className="r-title-line">
                {role.title}
                {role.location ? ` • ${role.location}` : ""}
              </p>
              {role.bullets?.length > 0 && (
                <ul className="r-bullets">
                  {role.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="r-section">
          <h2 className="r-section-title">Education</h2>
          {data.education.map((edu, i) => (
            <div className="r-edu" key={i}>
              <div className="r-edu-header">
                <span className="r-degree">{edu.degree}</span>
                <span className="r-dates">
                  {edu.startYear} {edu.startYear && edu.endYear ? "–" : ""}{" "}
                  {edu.endYear}
                </span>
              </div>
              <p className="r-school">
                {edu.school}
                {edu.location ? ` • ${edu.location}` : ""}
              </p>
            </div>
          ))}
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="r-section">
          <h2 className="r-section-title">Skills</h2>
          <p className="r-skills-list">{data.skills.join(" • ")}</p>
        </section>
      )}
    </div>
  );
}

export const RESUME_TEMPLATE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

.resume-page {
  width: 210mm;
  min-height: 297mm;
  padding: 18mm 16mm;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 10pt;
  line-height: 1.4;
  color: #1a1a1a;
  background: white;
  box-sizing: border-box;
  margin: 0 auto;
}
.resume-page h1, .resume-page h2, .resume-page h3, .resume-page p { margin: 0; }
.resume-page ul { margin: 4px 0; padding-left: 16px; }

.r-header { text-align: center; margin-bottom: 6px; }
.r-name {
  font-size: 22pt;
  font-weight: 700;
  color: #2563eb;
  margin: 0 0 6px;
  letter-spacing: 0.5px;
}
.r-contact {
  font-size: 9pt;
  color: #475569;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}
.r-contact span:not(:last-child)::after {
  content: "•";
  margin-left: 14px;
  color: #cbd5e1;
}

.r-divider { border: none; border-top: 1px solid #cbd5e1; margin: 10px 0 14px; }

.r-target-title {
  font-size: 11pt;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  text-align: center;
}

.r-summary {
  font-size: 10pt;
  line-height: 1.45;
  color: #334155;
  margin: 0 0 14px;
}

.r-section { margin-bottom: 14px; }
.r-section-title {
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #2563eb;
  border-bottom: 1px solid #dbeafe;
  padding-bottom: 3px;
  margin: 0 0 8px;
}

.r-role { margin-bottom: 10px; }
.r-role-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.r-company { font-weight: 700; font-size: 10.5pt; color: #0f172a; }
.r-dates { font-size: 9pt; color: #64748b; white-space: nowrap; }
.r-title-line { font-size: 10pt; color: #475569; font-style: italic; margin: 1px 0 4px; }

.r-bullets { margin: 0; padding-left: 16px; }
.r-bullets li { font-size: 9.5pt; margin-bottom: 2px; line-height: 1.4; }

.r-edu { margin-bottom: 6px; }
.r-edu-header { display: flex; justify-content: space-between; align-items: baseline; }
.r-degree { font-weight: 700; font-size: 10pt; }
.r-school { font-size: 9.5pt; color: #475569; margin: 1px 0 0; }

.r-skills-list { font-size: 9.5pt; color: #334155; margin: 0; line-height: 1.5; }

@media print {
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: white; }
  .resume-page { box-shadow: none; margin: 0; padding: 18mm 16mm; }
}
`;
