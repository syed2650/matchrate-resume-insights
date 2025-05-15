
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackRewriteUsage } from "../utils";

interface ResumeCopyButtonProps {
  currentResume: string;
  disabled?: boolean;
}

const ResumeCopyButton: React.FC<ResumeCopyButtonProps> = ({
  currentResume,
  disabled = false
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (disabled || !currentResume) {
      toast({ title: "Error", description: "No resume content available to copy", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(currentResume);
    trackRewriteUsage();
    toast({ title: "Success", description: "Resume copied to clipboard" });
  };

  return (
    <Button 
      variant="default" 
      size="sm"
      onClick={handleCopy}
      disabled={disabled}
      className="flex-1 sm:flex-none"
    >
      <Copy className="mr-1.5 h-4 w-4" /> Copy
    </Button>
  );
};

export default ResumeCopyButton;
