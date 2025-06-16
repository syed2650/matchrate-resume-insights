
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Download, Star, Loader2, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from "@/components/sections/Footer";
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AnalysisResults {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  userQuestionResponse?: string;
  sections: {
    formatting: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    content: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    atsCompatibility: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    structure: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
  };
  keyFindings: string[];
}

const ResumeFeedback = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [userQuestions, setUserQuestions] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [extractingText, setExtractingText] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const commonQuestions = [
    { text: "Should I put my education at the top or bottom?", value: "education section placement" },
    { text: "How can I make my bullet points more impactful?", value: "bullet point impact" },
    { text: "I'm changing careers - how should I position myself?", value: "career change concerns" },
    { text: "Is my resume ATS-friendly enough?", value: "ATS optimization" },
    { text: "What's the best order for my resume sections?", value: "section ordering" }
  ];

  const handleQuickFill = (questionValue: string) => {
    if (userQuestions) {
      setUserQuestions(userQuestions + "\n\n" + questionValue);
    } else {
      setUserQuestions(questionValue);
    }
  };

  // Extract text from different file types
  const extractTextFromFile = async (file: File): Promise<string> => {
    setExtractingText(true);
    
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(new Uint8Array(arrayBuffer)).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        return fullText;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (file.type === 'text/plain') {
        return await file.text();
      } else if (file.type.startsWith('image/')) {
        setOcrProgress(0);
        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        });
        return result.data.text;
      }
      
      throw new Error('Unsupported file type');
    } finally {
      setExtractingText(false);
      setOcrProgress(0);
    }
  };

  // Analyze resume content using OpenAI with personalized questions
  const analyzeResumeContent = async (text: string, questions: string): Promise<AnalysisResults> => {
    const response = await fetch(`https://rodkrpeqxgqizngdypbl.supabase.co/functions/v1/analyze-resume-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGtycGVxeGdxaXpuZ2R5cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDY5ODEsImV4cCI6MjA2MDcyMjk4MX0.ECPKii1lST8GcNt0M8SGXKLeeyJSL6vtIpoXVH5SZYA`
      },
      body: JSON.stringify({ 
        resumeText: text,
        userQuestions: questions 
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    return await response.json();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setResults(null);

      try {
        const extractedText = await extractTextFromFile(selectedFile);
        setResumeText(extractedText);
        
        if (extractedText.trim().length < 100) {
          toast({
            title: "Insufficient content",
            description: "We couldn't extract enough text from your file. Please try a different format.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "File processed successfully",
          description: `Extracted content from ${selectedFile.name}`
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Error processing file",
          description: "Please try a different file or format",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please upload a resume file first",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      const analysisResults = await analyzeResumeContent(resumeText, userQuestions);
      setResults(analysisResults);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully"
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const ScoreCircle = ({ score, label, color = "blue" }: { score: number; label: string; color?: string }) => (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${score * 0.628} 62.8`}
            className={`text-${color}-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );

  const SectionAnalysis = ({ title, data, icon: Icon }: { 
    title: string; 
    data: { score: number; issues: string[]; suggestions: string[] }; 
    icon: React.ElementType 
  }) => (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2 text-warm-accent" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`ml-auto px-2 py-1 rounded text-sm font-medium ${
          data.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
          data.score >= 60 ? 'bg-amber-100 text-amber-800' :
          'bg-rose-100 text-rose-800'
        }`}>
          {data.score}/100
        </span>
      </div>
      
      {data.issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-slate-700 mb-2">Issues Found:</h4>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {data.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <h4 className="font-medium text-slate-700 mb-2">Recommendations:</h4>
        <ul className="list-disc list-inside text-sm text-emerald-700 space-y-1">
          {data.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </Card>
  );

  const clearFile = () => {
    setFile(null);
    setResumeText('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header section */}
      <section className="w-full hero-gradient pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-warm-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-warm-accent/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border border-white/30 shadow-sm text-sm font-medium text-slate-600 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-warm-accent"></span>
            </span>
            AI-Powered Resume Analysis
          </div>

          <h1 className="mb-6 text-4xl md:text-6xl font-bold text-warm-text leading-tight tracking-tight">
            Get Professional Resume <br className="hidden md:block" />
            <span className="text-gradient">Health Check in 30 Seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-8 font-medium mx-auto">
            Upload your resume and get comprehensive AI-powered feedback on content quality, 
            ATS compatibility, and professional formatting.
          </p>
          
          <p className="text-md text-slate-500 max-w-2xl mb-12 mx-auto">
            Completely free • No signup required • Instant results
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          {!results ? (
            <Card className="p-8">
              {/* Upload Section */}
              <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive ? 'border-warm-accent bg-warm-accent/5' : 'border-slate-300 hover:border-warm-accent/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-slate-600 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <Button className="cta-gradient text-white">
                  Choose File
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Supports PDF, DOCX, TXT, JPG, PNG • Max 5MB
                </p>
              </div>

              {/* Questions Section */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-warm-accent" />
                  <h3 className="text-lg font-semibold">Any Specific Questions or Concerns?</h3>
                  <span className="text-sm text-slate-500">(Optional)</span>
                </div>
                
                <Textarea
                  placeholder="e.g., 'Should I put my education section before or after experience? I'm worried about career gaps in 2022...' 

Ask anything you'd normally ask on Reddit about your resume - our AI will give you personalized advice!"
                  value={userQuestions}
                  onChange={(e) => setUserQuestions(e.target.value)}
                  className="min-h-[120px] mb-4"
                />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Quick-fill common questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickFill(question.value)}
                        className="text-xs h-8"
                      >
                        {question.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-warm-accent" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-slate-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleAnalyze}
                        disabled={analyzing || extractingText || !resumeText.trim()}
                        className="cta-gradient text-white"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Analyze Resume'
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFile}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {extractingText && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center mb-2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                    <p className="text-blue-700">
                      {file?.type.startsWith('image/') ? 'Extracting text with OCR...' : 'Processing file...'}
                    </p>
                  </div>
                  {ocrProgress > 0 && (
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${ocrProgress}%`}}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* Features Preview */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <h4 className="font-semibold mb-1">ATS Compatibility</h4>
                  <p className="text-sm text-slate-600">Check if your resume passes automated screening systems</p>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-warm-accent" />
                  <h4 className="font-semibold mb-1">Content Analysis</h4>
                  <p className="text-sm text-slate-600">AI-powered feedback on writing quality and impact</p>
                </div>
                <div className="text-center p-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                  <h4 className="font-semibold mb-1">Formatting Review</h4>
                  <p className="text-sm text-slate-600">Professional formatting and structure recommendations</p>
                </div>
                <div className="text-center p-4">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1">Personalized Advice</h4>
                  <p className="text-sm text-slate-600">Get answers to your specific resume questions</p>
                </div>
              </div>
            </Card>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              {/* Overall Scores */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Resume Analysis</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <ScoreCircle score={results.overallScore} label="Overall Score" color="blue" />
                  <ScoreCircle score={results.atsScore} label="ATS Score" color="green" />
                  <ScoreCircle score={results.contentScore} label="Content Score" color="purple" />
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                    {results.keyFindings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Personalized Response to User Questions */}
              {results.userQuestionResponse && (
                <Card className="p-6 border-2 border-warm-accent/20 bg-warm-accent/5">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="w-6 h-6 mr-2 text-warm-accent" />
                    <h3 className="text-xl font-semibold text-warm-text">Your Questions Answered</h3>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                      {results.userQuestionResponse}
                    </div>
                  </div>
                </Card>
              )}

              {/* Detailed Analysis */}
              <div className="grid gap-6">
                <SectionAnalysis 
                  title="ATS Compatibility" 
                  data={results.sections.atsCompatibility}
                  icon={CheckCircle}
                />
                <SectionAnalysis 
                  title="Content Quality" 
                  data={results.sections.content}
                  icon={FileText}
                />
                <SectionAnalysis 
                  title="Formatting & Structure" 
                  data={results.sections.formatting}
                  icon={TrendingUp}
                />
                <SectionAnalysis 
                  title="Overall Structure" 
                  data={results.sections.structure}
                  icon={AlertCircle}
                />
              </div>

              {/* CTA Section */}
              <Card className="cta-gradient p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Want Job-Specific Optimization?</h3>
                <p className="text-lg mb-6">
                  Get your resume scored against specific job descriptions with our advanced matching tool
                </p>
                <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                  <Button 
                    className="bg-white text-warm-accent hover:bg-slate-100 block w-full md:w-auto"
                    onClick={() => navigate('/review')}
                  >
                    Try Job-Specific Matching
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-warm-accent block w-full md:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </Card>

              {/* Analyze Another */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setResumeText('');
                    setResults(null);
                    setUserQuestions('');
                  }}
                  className="text-warm-accent hover:text-warm-accent/80"
                >
                  Analyze Another Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResumeFeedback;
