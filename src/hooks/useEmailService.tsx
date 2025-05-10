
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface FeedbackNotificationParams {
  submissionId: string;
  userId?: string;
  score?: number;
  jobTitle?: string;
  recipientEmail?: string;
}

export function useEmailService() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (params: EmailParams) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: params
      });

      if (error) {
        console.error("Error sending email:", error);
        toast({
          title: "Email Failed",
          description: "There was a problem sending the email. Please try again.",
          variant: "destructive",
        });
        return { success: false, error };
      }

      toast({
        title: "Email Sent",
        description: "The email has been sent successfully.",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error("Exception sending email:", err);
      toast({
        title: "Email Failed",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedbackNotification = async (params: FeedbackNotificationParams) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('resume-feedback-notification', {
        body: params
      });

      if (error) {
        console.error("Error sending feedback notification:", error);
        toast({
          title: "Notification Failed",
          description: "There was a problem sending the feedback notification. Please try again.",
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Notification Sent",
        description: "The feedback notification has been sent successfully.",
      });
      
      return { success: true, data };
    } catch (err) {
      console.error("Exception sending feedback notification:", err);
      toast({
        title: "Notification Failed",
        description: "There was a problem sending the feedback notification. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    sendFeedbackNotification,
    isLoading
  };
}
