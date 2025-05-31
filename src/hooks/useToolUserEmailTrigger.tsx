
import { useEffect } from 'react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { supabase } from '@/integrations/supabase/client';

export const useToolUserEmailTrigger = () => {
  const { user } = useAuthUser();

  useEffect(() => {
    if (user && !sessionStorage.getItem(`welcome_email_sent_${user.id}`)) {
      // Check if this is a new user (first login)
      const triggerWelcomeEmail = async () => {
        try {
          // Get user profile to check if we should send welcome email
          const { data: profile } = await supabase
            .from('profiles')
            .select('email_sequence_step, created_at')
            .eq('id', user.id)
            .single();

          // If user has no email sequence step or it's 0, send welcome email
          if (!profile?.email_sequence_step || profile.email_sequence_step === 0) {
            await supabase.functions.invoke('tool-user-email-automation', {
              body: {
                type: 'tool_welcome',
                userId: user.id,
                userEmail: user.email,
                userName: user.user_metadata?.full_name
              }
            });

            // Mark as sent for this session
            sessionStorage.setItem(`welcome_email_sent_${user.id}`, 'true');
          }
        } catch (error) {
          console.error('Error triggering welcome email:', error);
        }
      };

      // Small delay to ensure user is properly authenticated
      setTimeout(triggerWelcomeEmail, 2000);
    }
  }, [user]);

  const triggerAnalysisEmail = async () => {
    if (user) {
      try {
        // Update user's first analysis date if not set
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_analysis_date, analysis_count')
          .eq('id', user.id)
          .single();

        if (!profile?.first_analysis_date) {
          await supabase
            .from('profiles')
            .update({
              first_analysis_date: new Date().toISOString(),
              analysis_count: (profile?.analysis_count || 0) + 1
            })
            .eq('id', user.id);
        } else {
          // Just increment analysis count
          await supabase
            .from('profiles')
            .update({
              analysis_count: (profile?.analysis_count || 0) + 1
            })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('Error updating user analysis stats:', error);
      }
    }
  };

  return { triggerAnalysisEmail };
};
