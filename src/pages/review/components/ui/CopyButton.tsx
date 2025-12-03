import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "ghost" | "default";
}

export const CopyButton = ({ 
  text, 
  label = "Copy", 
  size = "sm",
  variant = "outline" 
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ 
        title: "Failed to copy", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className="gap-1.5"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
};
