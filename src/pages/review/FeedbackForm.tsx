
import React from "react";
import { Button } from "@/components/ui/button";

interface FeedbackFormProps {
  helpfulFeedback: boolean | null;
  onFeedbackSubmit: (isHelpful: boolean) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  helpfulFeedback, 
  onFeedbackSubmit 
}) => {
  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Was this helpful?
      </h3>
      <div className="flex space-x-4">
        <Button
          variant={helpfulFeedback === true ? "default" : "outline"}
          disabled={helpfulFeedback !== null}
          onClick={() => onFeedbackSubmit(true)}
        >
          Yes
        </Button>
        <Button
          variant={helpfulFeedback === false ? "default" : "outline"}
          disabled={helpfulFeedback !== null}
          onClick={() => onFeedbackSubmit(false)}
        >
          No
        </Button>
      </div>
      {helpfulFeedback !== null && (
        <p className="mt-2 text-slate-600">
          Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default FeedbackForm;
