
-- Shared trigger function to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.analyzer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  analysis JSONB,
  rewritten_resume_html TEXT,
  match_score INTEGER,
  ats_score INTEGER,
  job_fit_score INTEGER,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_analyzer_sessions_user ON public.analyzer_sessions(user_id);
CREATE INDEX idx_analyzer_sessions_stripe ON public.analyzer_sessions(stripe_session_id);

ALTER TABLE public.analyzer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create analyzer sessions"
ON public.analyzer_sessions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own analyzer sessions"
ON public.analyzer_sessions
FOR SELECT
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyzer sessions"
ON public.analyzer_sessions
FOR UPDATE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Service role full access analyzer_sessions"
ON public.analyzer_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_analyzer_sessions_updated_at
BEFORE UPDATE ON public.analyzer_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
