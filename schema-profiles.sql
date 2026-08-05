-- Founder Hub — Profiles Table
-- This table stores the user's executive role and profile info.
-- It is populated during the one-time onboarding flow after first sign-up.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  executive_role text check (executive_role in ('ceo', 'cfo', 'cmo', 'cto', 'tech-lead')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Users can only read and update their own profile
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);
