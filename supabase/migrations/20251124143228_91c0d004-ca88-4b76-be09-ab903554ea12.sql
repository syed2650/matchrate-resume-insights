-- Create public_profiles table for lovable jobs feature
create table if not exists public.public_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  resume_text text,
  summary text,
  feedback text,
  mode text check (mode in ('roast', 'love')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.public_profiles enable row level security;

-- Allow public read access to profiles
create policy "Allow public read access to public_profiles"
on public.public_profiles
for select
using (true);

-- Allow service role to insert profiles
create policy "Allow service role to insert public_profiles"
on public.public_profiles
for insert
with check (true);

-- Create index on slug for faster lookups
create index if not exists idx_public_profiles_slug on public.public_profiles(slug);