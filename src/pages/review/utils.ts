
/**
 * Utility functions for resume reviews
 */

export function getATSScoreExplanation(score: number): string {
  if (score >= 90) {
    return "This resume is highly optimized for ATS systems with excellent keyword matching, clear structure, and professional formatting.";
  } else if (score >= 80) {
    return "This resume has good ATS compatibility with strong keyword usage and proper section formatting.";
  } else if (score >= 70) {
    return "This resume has adequate ATS compatibility but could improve keyword alignment and section structure.";
  } else {
    return "This resume needs optimization for ATS systems, including better keyword matching and clearer section formatting.";
  }
}
