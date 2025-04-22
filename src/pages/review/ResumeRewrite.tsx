
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeRewriteProps {
  rewrittenResume: string | null;
}

const ResumeRewrite: React.FC<ResumeRewriteProps> = ({ rewrittenResume }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (rewrittenResume) {
      navigator.clipboard.writeText(rewrittenResume).then(() => {
        toast({
          title: "Success",
          description: "Resume copied to clipboard",
        });
      }).catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy resume to clipboard",
          variant: "destructive"
        });
      });
    }
  };

  if (!rewrittenResume) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-600">No rewritten resume available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-900">Optimized Resume</h3>
        <Button variant="outline" onClick={handleCopyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </Button>
      </div>
      
      <div className="border rounded-md p-4 bg-slate-50">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm">
          {rewrittenResume}
        </pre>
      </div>
    </div>
  );
};

export default ResumeRewrite;
