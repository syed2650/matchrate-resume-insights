import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface DownloadPDFButtonProps {
  content: string;
  filename: string;
  title?: string;
}

export const DownloadPDFButton = ({ 
  content, 
  filename,
  title = "Analysis Report"
}: DownloadPDFButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, 25);
      
      // Content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      // Clean content and split into lines
      const cleanContent = content
        .replace(/[#*]/g, '')
        .replace(/\n{3,}/g, '\n\n');
      
      const lines = doc.splitTextToSize(cleanContent, maxWidth);
      
      let y = 40;
      const lineHeight = 6;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      doc.save(`${filename}.pdf`);
      toast({ title: "PDF downloaded successfully!" });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({ 
        title: "Failed to generate PDF", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      Download PDF
    </Button>
  );
};
