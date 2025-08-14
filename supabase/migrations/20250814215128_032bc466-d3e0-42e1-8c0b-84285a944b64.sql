-- Fix security vulnerability: Remove public read access from email_subscribers table
-- Drop the overly permissive public policy and create a proper service role policy

DROP POLICY IF EXISTS "Allow service role full access to email_subscribers" ON public.email_subscribers;

-- Create proper service role only policy
CREATE POLICY "Service role full access to email_subscribers" 
ON public.email_subscribers 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Ensure the existing public insert policy remains for newsletter signups
-- (This policy already exists but confirming it's correct)
DROP POLICY IF EXISTS "Allow public insert for email subscriptions" ON public.email_subscribers;
CREATE POLICY "Allow public insert for email subscriptions" 
ON public.email_subscribers 
FOR INSERT 
TO public 
WITH CHECK (true);