-- Create RLS policies for resumes bucket (if not already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload their own resumes'
  ) THEN
    CREATE POLICY "Users can upload their own resumes"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can view their own resumes'
  ) THEN
    CREATE POLICY "Users can view their own resumes"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own resumes'
  ) THEN
    CREATE POLICY "Users can update their own resumes"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own resumes'
  ) THEN
    CREATE POLICY "Users can delete their own resumes"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Create resume_reviews table
CREATE TABLE IF NOT EXISTS public.resume_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  original_text TEXT NOT NULL,
  rewritten_text TEXT,
  ats_score INTEGER,
  ats_feedback JSONB,
  match_score INTEGER,
  match_feedback JSONB,
  roast_card JSONB,
  share_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resume_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resume_reviews
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resume_reviews' 
    AND policyname = 'Users can insert their own reviews'
  ) THEN
    CREATE POLICY "Users can insert their own reviews"
    ON public.resume_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resume_reviews' 
    AND policyname = 'Users can view their own reviews'
  ) THEN
    CREATE POLICY "Users can view their own reviews"
    ON public.resume_reviews
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resume_reviews' 
    AND policyname = 'Users can update their own reviews'
  ) THEN
    CREATE POLICY "Users can update their own reviews"
    ON public.resume_reviews
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resume_reviews' 
    AND policyname = 'Public can view shared reviews'
  ) THEN
    CREATE POLICY "Public can view shared reviews"
    ON public.resume_reviews
    FOR SELECT
    USING (share_url IS NOT NULL);
  END IF;
END $$;