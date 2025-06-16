
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Download, Star, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AnalysisResults {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  sections: {
    formatting: SectionData;
    content: SectionData;
    atsCompatibility: SectionData;
    structure: SectionData;
  };
  keyFindings: string[];
}

interface SectionData {
  score: number;
  issues: string[];
  suggestions: string[];
}

const ResumeFeedback = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractingText, setExtractingText] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
      setExtractingText(true);
      setOcrProgress(0);
      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        });
        setExtractingText(false);
        return result.data.text;
      } catch (error) {
        setExtractingText(false);
        throw new Error('Failed to extract text from image');
      }
    } else if (file.type === 'application/pdf') {
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
    } else {
      throw new Error('Unsupported file type');
    }
  };

  const analyzeResumeWithAI = async (resumeText: string): Promise<AnalysisResults> => {
    const response = await fetch('/api/analyze-resume-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    return await response.json();
  };

  const analyzeResume = async (file: File) => {
    setAnalyzing(true);
    
    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length < 100) {
        throw new Error('Could not extract sufficient text from the file');
      }

      // Analyze with AI
      const analysisResults = await analyzeResumeWithAI(resumeText);
      
      setResults(analysisResults);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain', 
      'image/jpeg', 
      'image/png',
      'image/webp'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, TXT, JPG, PNG, or WebP file",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setResults(null);
  };

  const ScoreCircle = ({ score, label, color = "blue" }: { score: number; label: string; color?: string }) => (
    <div className="text-center">
      <div className={`relative w-24 h-24 mx-auto mb-2`}>
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
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );

  const SectionAnalysis = ({ title, data, icon: Icon }: { title: string; data: SectionData; icon: any }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2 text-blue-500" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`ml-auto px-2 py-1 rounded text-sm font-medium ${
          data.score >= 80 ? 'bg-green-100 text-green-800' :
          data.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {data.score}/100
        </span>
      </div>
      
      {data.issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Issues Found:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {data.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
          {data.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Free Resume Feedback Tool
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Get your resume professionally analyzed in under 30 seconds
          </p>
          <p className="text-sm text-slate-500">
            By MatchRate.co • Free forever • No signup required
          </p>
        </div>

        {!results ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Upload Section */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-coral bg-coral-light' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-coral text-white rounded-lg hover:bg-coral-dark cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOCX, TXT, JPG, PNG, WebP • Max 5MB
              </p>
            </div>

            {extractingText && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                  <p className="text-blue-700">Extracting text from image...</p>
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

            {file && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => analyzeResume(file)}
                    disabled={analyzing || extractingText}
                    className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
                <p className="mt-2 text-gray-600">Analyzing your resume...</p>
                <p className="text-sm text-gray-500">This usually takes 15-30 seconds</p>
              </div>
            )}

            {/* Features Preview */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="text-center p-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h4 className="font-semibold mb-1">ATS Compatibility</h4>
                <p className="text-sm text-gray-600">Check if your resume passes automated screening systems</p>
              </div>
              <div className="text-center p-4">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-semibold mb-1">Content Analysis</h4>
                <p className="text-sm text-gray-600">AI-powered feedback on writing quality and impact</p>
              </div>
              <div className="text-center p-4">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <h4 className="font-semibold mb-1">Formatting Review</h4>
                <p className="text-sm text-gray-600">Professional formatting and structure recommendations</p>
              </div>
              <div className="text-center p-4">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h4 className="font-semibold mb-1">Actionable Tips</h4>
                <p className="text-sm text-gray-600">Specific suggestions to improve your resume</p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Overall Scores */}
            <div className="bg-white rounded-lg shadow-lg p-6">
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
            </div>

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
            <div className="bg-gradient-to-r from-coral to-coral-dark rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Want Job-Specific Optimization?</h3>
              <p className="text-lg mb-6">
                Get your resume scored against specific job descriptions with our advanced matching tool
              </p>
              <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                <a
                  href="/review"
                  className="bg-white text-coral px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 block w-full md:w-auto"
                >
                  Try MatchRate.co Pro
                </a>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-coral block w-full md:w-auto">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Report
                </button>
              </div>
            </div>

            {/* Analyze Another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setFile(null);
                  setResults(null);
                }}
                className="text-coral hover:text-coral-dark font-medium"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeFeedback;
