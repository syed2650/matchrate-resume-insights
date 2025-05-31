import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEmailService } from "@/hooks/useEmailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Target, TrendingUp, Clock } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

interface Section {
  id: string;
  name: string;
  icon: string;
  items: ChecklistItem[];
  expanded: boolean;
}

const FreeATSCheck = () => {
  const { toast } = useToast();
  const { sendEmail, isLoading: emailLoading } = useEmailService();
  const [totalScore, setTotalScore] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sections, setSections] = useState<Section[]>([
    {
      id: 'format',
      name: 'Format & Structure',
      icon: '📄',
      expanded: true,
      items: [
        {
          id: 'format-1',
          title: 'Use Standard Section Headings',
          description: 'Include: "Professional Summary," "Work Experience," "Education," "Skills." Avoid creative headings like "My Journey."',
          points: 1,
          completed: false
        },
        {
          id: 'format-2',
          title: 'Save in ATS-Friendly Format',
          description: 'Use .docx or .pdf formats. Avoid .pages, .txt, .rtf, or image files.',
          points: 1,
          completed: false
        },
        {
          id: 'format-3',
          title: 'Simple, Single-Column Layout',
          description: 'Avoid tables, columns, text boxes. ATS systems read left to right, top to bottom.',
          points: 1,
          completed: false
        },
        {
          id: 'format-4',
          title: 'Standard Fonts Only',
          description: 'Use Arial, Calibri, Times New Roman, or Helvetica. Font size 10-12pt.',
          points: 1,
          completed: false
        },
        {
          id: 'format-5',
          title: 'No Headers, Footers, or Graphics',
          description: 'Place contact info in main body. ATS often can\'t read headers/footers.',
          points: 1,
          completed: false
        }
      ]
    },
    {
      id: 'keywords',
      name: 'Keywords & Content',
      icon: '🎯',
      expanded: false,
      items: [
        {
          id: 'keywords-1',
          title: 'Include Exact Job Title',
          description: 'Use the exact job title from the posting somewhere in your resume.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-2',
          title: 'Industry-Specific Keywords',
          description: 'Include 5-10 relevant keywords from job description naturally throughout.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-3',
          title: 'Match Required Skills',
          description: 'List technical skills and software mentioned in job requirements.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-4',
          title: 'Include Relevant Certifications',
          description: 'List certifications and tools mentioned in job posting with full names.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-5',
          title: 'Use Strong Action Verbs',
          description: 'Start bullet points with: managed, developed, implemented, increased, created.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-6',
          title: 'Quantify All Achievements',
          description: 'Include numbers, percentages, dollar amounts in every bullet point.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-7',
          title: 'Include Company Names & Locations',
          description: 'Full company names and city, state help ATS categorize experience.',
          points: 1,
          completed: false
        },
        {
          id: 'keywords-8',
          title: 'Spell Out Acronyms',
          description: 'First mention: "Search Engine Optimization (SEO)" then use "SEO."',
          points: 1,
          completed: false
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Details',
      icon: '⚡',
      expanded: false,
      items: [
        {
          id: 'technical-1',
          title: 'Contact Info in Main Body',
          description: 'Include name, phone, email, LinkedIn at top of document, not in header.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-2',
          title: 'Consistent Date Formatting',
          description: 'Use same format throughout: "January 2020 - March 2023" consistently.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-3',
          title: 'Avoid Special Characters',
          description: 'Skip fancy bullets (•, ★, ➤), use simple hyphens or standard bullets.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-4',
          title: 'Simple File Name',
          description: 'Name file: "FirstName_LastName_Resume.pdf" - avoid spaces.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-5',
          title: 'Selectable Text',
          description: 'Ensure all text can be highlighted/copied. Avoid image-based text.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-6',
          title: 'Use Bullet Points',
          description: 'Format job descriptions as bullet points, not paragraphs.',
          points: 1,
          completed: false
        },
        {
          id: 'technical-7',
          title: 'Optimal Length',
          description: 'Keep to 1-2 pages maximum. 1 page for entry-level, 2 for experienced.',
          points: 1,
          completed: false
        }
      ]
    }
  ]);

  const maxScore = 20;

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : section
    ));
  };

  useEffect(() => {
    const newTotal = sections.reduce((total, section) => 
      total + section.items.reduce((sectionTotal, item) => 
        sectionTotal + (item.completed ? item.points : 0), 0
      ), 0
    );
    setTotalScore(newTotal);
  }, [sections]);

  const getSectionScore = (section: Section) => {
    return section.items.reduce((total, item) => total + (item.completed ? item.points : 0), 0);
  };

  const getSectionMaxScore = (section: Section) => {
    return section.items.reduce((total, item) => total + item.points, 0);
  };

  const getScoreInterpretation = () => {
    if (totalScore >= 18) return { label: '🎉 Excellent! ATS Ready', color: 'bg-green-500' };
    if (totalScore >= 15) return { label: '👍 Good - Minor tweaks needed', color: 'bg-blue-500' };
    if (totalScore >= 12) return { label: '⚠️ Needs Work - Several improvements', color: 'bg-yellow-500' };
    if (totalScore >= 8) return { label: '🔧 Requires Major Changes', color: 'bg-orange-500' };
    return { label: '🚨 Critical - Complete Overhaul Needed', color: 'bg-red-500' };
  };

  const prepareSectionScores = () => {
    const sectionScores: { [key: string]: { score: number; maxScore: number; missing: string[] } } = {};
    const completedItems: { [key: string]: string[] } = {};
    const missingItems: { [key: string]: string[] } = {};

    sections.forEach(section => {
      const score = getSectionScore(section);
      const maxScore = getSectionMaxScore(section);
      const missing = section.items.filter(item => !item.completed).map(item => item.title);
      const completed = section.items.filter(item => item.completed).map(item => item.title);

      sectionScores[section.id] = { score, maxScore, missing };
      completedItems[section.id] = completed;
      missingItems[section.id] = missing;
    });

    return { sectionScores, completedItems, missingItems };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { sectionScores, completedItems, missingItems } = prepareSectionScores();

      // Call the new ATS checker submission edge function
      const { data, error } = await supabase.functions.invoke('ats-checker-submission', {
        body: {
          name,
          email,
          totalScore,
          sectionScores,
          completedItems,
          missingItems
        }
      });

      if (error) throw error;

      toast({
        title: "Report Sent!",
        description: `Thanks ${name}! Your detailed ATS report and email sequence will start within 5 minutes at ${email}.`,
      });

      // Reset form
      setName('');
      setEmail('');

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const interpretation = getScoreInterpretation();
  const scorePercentage = (totalScore / maxScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 bg-indigo-100 text-indigo-800">
            MatchRate
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interactive ATS Resume Checker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Check your resume against 20 critical ATS factors and get your instant compatibility score
          </p>

          {/* Score Display */}
          <Card className="max-w-md mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${scorePercentage * 3.14} 314`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{totalScore}</div>
                    <div className="text-sm opacity-80">/ 20</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{interpretation.label}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">75%</div>
              <div className="text-sm text-gray-600">Resumes Rejected by ATS</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">6 sec</div>
              <div className="text-sm text-gray-600">Human Review Time</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">3x</div>
              <div className="text-sm text-gray-600">More Interviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Intro */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Why This Matters
            </h2>
            <p className="text-gray-600 mb-4">
              Most resumes never reach human eyes. Use this interactive checklist to ensure your resume passes ATS filters and gets you more interviews.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips for Maximum Impact</h4>
              <div className="space-y-1 text-sm text-yellow-700">
                <p><strong>Keyword Density:</strong> Aim for 2-3% keyword density throughout your resume.</p>
                <p><strong>Customization:</strong> Tailor your resume for each application - generic resumes have 50% lower success rates.</p>
                <p><strong>Skills Balance:</strong> Include both hard skills (software) and soft skills (leadership) from job posting.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-6 mb-8">
          {sections.map((section) => {
            const sectionScore = getSectionScore(section);
            const sectionMaxScore = getSectionMaxScore(section);
            const sectionPercentage = (sectionScore / sectionMaxScore) * 100;
            const isCompleted = sectionScore === sectionMaxScore;

            return (
              <Card key={section.id} className={`transition-all duration-300 ${isCompleted ? 'ring-2 ring-green-500 shadow-lg' : ''}`}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{section.name}</CardTitle>
                        <CardDescription>{sectionScore}/{sectionMaxScore} completed</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right min-w-[120px]">
                        <Progress value={sectionPercentage} className="w-20 mb-1" />
                        <div className="text-sm font-medium">{sectionScore}/{sectionMaxScore}</div>
                      </div>
                      {section.expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </CardHeader>
                
                {section.expanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 ${
                            item.completed 
                              ? 'bg-green-50 border-l-green-500' 
                              : 'bg-gray-50 border-l-gray-300'
                          }`}
                          onClick={() => toggleItem(section.id, item.id)}
                        >
                          <div className="mt-0.5">
                            {item.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Results Section */}
        {totalScore > 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-900">🎯 Your ATS Compatibility Score</CardTitle>
              <div className="text-4xl font-bold text-blue-600 my-4">{totalScore}/20</div>
              <CardDescription className="text-blue-700 text-base">
                {totalScore >= 18 ? 'Outstanding! Your resume will pass most ATS systems with flying colors.' :
                 totalScore >= 15 ? 'Great job! A few small improvements will make your resume even stronger.' :
                 totalScore >= 12 ? 'You\'re on the right track, but several key areas need attention.' :
                 totalScore >= 8 ? 'Your resume needs significant improvements to pass ATS filters.' :
                 'Major revision required. Focus on the basics first.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-center">📧 Get Your Detailed Results + 5-Email Success Series</CardTitle>
                  <CardDescription className="text-center">
                    Enter your email to receive a personalized report plus our proven email sequence that helps job seekers optimize their resumes and land more interviews.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      disabled={isSubmitting || emailLoading}
                    >
                      {isSubmitting || emailLoading ? 'Sending Report...' : 'Get My Detailed Report + Email Series 📊'}
                    </Button>
                  </form>
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    <p>✅ Personalized improvement recommendations</p>
                    <p>✅ 5-part email series with actionable tips</p>
                    <p>✅ Success stories and optimization strategies</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 Ready for Advanced Analysis?</h3>
            <p className="mb-2">This checklist gives you the foundation, but want to see your exact match score for specific jobs?</p>
            <p className="mb-4">Get instant AI-powered analysis of your resume against any job description:</p>
            <div className="text-xl font-bold text-blue-200 mb-4">www.MatchRate.co</div>
            <p className="text-sm opacity-90">✓ Instant job-specific scoring ✓ Keyword gap analysis ✓ Industry benchmarking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeATSCheck;
