
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeCopyButtonProps {
  currentResume: string;
}

const ResumeCopyButton: React.FC<ResumeCopyButtonProps> = ({
  currentResume
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentResume);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "Resume content copied to clipboard"
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={copyToClipboard} 
      className="w-full sm:w-auto"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy to Clipboard
        </>
      )}
    </Button>
  );
};

export default ResumeCopyButton;
