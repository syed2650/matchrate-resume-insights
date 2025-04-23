
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackFormProps {
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  helpfulFeedback,
  onFeedbackSubmit
}) => {
  if (helpfulFeedback !== null) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
        <p className="text-blue-800 font-medium">
          Thank you for your feedback! It helps us improve our AI analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <div className="text-center">
        <p className="text-lg font-medium text-slate-700 mb-4">
          Was this feedback helpful?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-200 hover:bg-green-50 hover:text-green-700"
            onClick={() => onFeedbackSubmit(true)}
          >
            <ThumbsUp className="h-5 w-5 text-green-600" />
            Yes, helpful
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => onFeedbackSubmit(false)}
          >
            <ThumbsDown className="h-5 w-5 text-red-600" />
            No, needs improvement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
