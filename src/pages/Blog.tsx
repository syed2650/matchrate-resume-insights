import { ScrollText, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { InternalLinkNav } from "@/components/InternalLinkNav";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const blogPosts = [
  {
    title: "LinkedIn Profile Optimization: How to Get Recruiters to Find YOU (Data from 8,000+ Profiles)",
    description: "Your resume gets you past ATS systems, but your LinkedIn profile gets recruiters to chase YOU. We analyzed 8,247 LinkedIn profiles across 15 industries to reveal the shocking truth: 93% of professionals have profiles that recruiters will never find.",
    date: "July 2025",
    link: "/blog/linkedin-profile-optimization"
  },
  {
    title: "Resume Templates That Pass Every ATS: Visual Analysis of 5,000+ Successful Formats (2025 Study)",
    description: "Beautiful resume templates are everywhere. ATS-compatible templates that actually work? Almost impossible to find. We analyzed 5,247 successful resume formats that not only passed ATS screening but generated interview requests across 12 major platforms.",
    date: "June 2025",
    link: "/blog/resume-templates-ats"
  },
  {
    title: "Resume Keywords That Actually Work: Data from 10,000+ ATS Scans (2025 Analysis)",
    description: "After reverse-engineering 15+ major ATS platforms and analyzing 10,247 resume scans, discover exactly which keywords lead to interview requests and which send resumes to the digital graveyard.",
    date: "June 2025",
    link: "/blog/resume-keywords-data"
  },
  {
    title: "The ATS Algorithm Exposed: How Resume Scanners Actually Work in 2025",
    description: "After reverse-engineering 15+ major ATS platforms and analyzing thousands of resume processing logs, discover exactly how these systems evaluate your resume.",
    date: "December 2024",
    link: "/blog/ats-algorithm-exposed"
  },
  {
    title: "Resume Psychology: What Hiring Managers Actually Think When They Read Your Resume",
    description: "Ever wondered what's really going through a hiring manager's mind when they scan your resume? Uncover the 7 psychological triggers that control hiring decisions.",
    date: "January 2025",
    link: "/blog/resume-psychology"
  },
  {
    title: "Resume Format That Actually Gets Interviews: 2025 ATS-Friendly Templates",
    description: "The difference between a resume that gets noticed and one that gets rejected often comes down to format. Here's exactly how to structure your resume.",
    date: "February 2025",
    link: "/blog/resume-format-guide"
  },
  {
    title: "10 Resume Mistakes That Guarantee Rejection (And How to Fix Them in 2025)",
    description: "Complete guide to the most common resume mistakes that lead to instant rejection, with actionable fixes for each one.",
    date: "March 2025",
    link: "/blog/resume-rejection-mistakes"
  },
  {
    title: "Resume Keywords That Actually Work: The Complete Guide",
    description: "Discover the exact keywords that hiring managers and ATS systems are looking for, plus proven strategies to incorporate them naturally.",
    date: "April 2025",
    link: "/blog/resume-keywords"
  },
  {
    title: "Why 95% of Resumes Get Rejected (And How to Fix Yours)",
    description: "The harsh reality of resume rejection and a step-by-step action plan to dramatically increase your interview success rate.",
    date: "May 2025",
    link: "/blog/resume-rejection"
  }
];

export default function Blog() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MatchRate Resume Success Blog",
    "description": "Expert career advice, resume optimization tips, and job search strategies to help you land more interviews and advance your career.",
    "url": "https://www.matchrate.co/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MatchRate",
      "logo": "https://www.matchrate.co/lovable-uploads/1995df7f-73f3-4583-9980-04dc5569cd1d.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.matchrate.co/blog"
    }
  };

  return (
    <>
      <SEOHead
        title="Resume Success Blog - Expert Career Advice & Job Search Tips"
        description="Expert career advice, resume optimization tips, and job search strategies. Learn from data-driven insights to improve your resume and land more interviews."
        keywords="resume tips, career advice, job search strategies, ATS optimization, resume writing, interview tips, career development"
        canonicalUrl="https://www.matchrate.co/blog"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-warm-bg relative overflow-hidden">
        <FloatingOrbs count={6} />
        
        <div className="container max-w-screen-xl mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <ScrollText className="h-5 w-5" />
              <span className="font-medium">Career Insights</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Resume Success <span className="animated-gradient-text">Blog</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Expert career advice, resume optimization tips, and job search strategies to help you land more interviews.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glassmorphism rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </div>
                <h2 className="text-lg font-semibold mb-3 text-warm-text line-clamp-2">{post.title}</h2>
                <p className="text-slate-600 mb-4 text-sm flex-grow line-clamp-3">{post.description}</p>
                <Button asChild className="w-full group">
                  <Link to={post.link} className="flex items-center justify-center gap-2">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center glassmorphism rounded-2xl p-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Ready to put these tips into action?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Get personalized feedback on your resume with our AI-powered analysis
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="cta-gradient">
                <Link to="/review">Analyze Your Resume Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <InternalLinkNav currentPage="blog" />
    </>
  );
}
