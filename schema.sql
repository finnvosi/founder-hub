-- Founder Hub Base Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  status text check (status in ('available', 'focus', 'away', 'offline')) default 'offline',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teams
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team Members
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  role text check (role in ('owner', 'admin', 'member')) default 'member' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (team_id, user_id)
);

-- Metrics (Core tracking)
create table public.metrics (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  key text not null,
  name text not null,
  current_value numeric not null default 0,
  target_value numeric,
  trend text check (trend in ('up', 'down', 'neutral')) default 'neutral',
  unit text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (team_id, key)
);

-- Decisions Journal
create table public.decisions (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  title text not null,
  status text check (status in ('pending', 'made', 'revisit')) default 'pending',
  context text,
  outcome text,
  author_id uuid references public.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.metrics enable row level security;
alter table public.decisions enable row level security;

-- Policies (Simplified for Phase 1: users can see their teams and related data)
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view teams they belong to" on public.teams for select using (
  exists (select 1 from public.team_members where team_id = id and user_id = auth.uid())
);

create policy "Users can view team members of their teams" on public.team_members for select using (
  exists (select 1 from public.team_members as tm where tm.team_id = team_id and tm.user_id = auth.uid())
);

create policy "Users can view metrics for their teams" on public.metrics for select using (
  exists (select 1 from public.team_members where team_id = metrics.team_id and user_id = auth.uid())
);

create policy "Users can view decisions for their teams" on public.decisions for select using (
  exists (select 1 from public.team_members where team_id = decisions.team_id and user_id = auth.uid())
);

-- Documents
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  title text not null default 'Untitled',
  content text,
  author_id uuid references public.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Files Hub
create table public.files (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  name text not null,
  size bigint not null default 0,
  type text not null default 'application/octet-stream',
  url text,
  folder_id uuid references public.files(id) on delete cascade,
  uploaded_by uuid references public.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Phase 2
alter table public.documents enable row level security;
alter table public.files enable row level security;

create policy "Users can view documents for their teams" on public.documents for select using (
  exists (select 1 from public.team_members where team_id = documents.team_id and user_id = auth.uid())
);

create policy "Users can view files for their teams" on public.files for select using (
  exists (select 1 from public.team_members where team_id = files.team_id and user_id = auth.uid())
);

-- Tasks
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  assignee_id uuid references public.users on delete set null,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Meetings
create table public.meetings (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  agenda_doc_id uuid references public.documents on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  team_id uuid references public.teams on delete cascade not null,
  type text not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Phase 3
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.notifications enable row level security;

create policy "Users can view tasks for their teams" on public.tasks for select using (
  exists (select 1 from public.team_members where team_id = tasks.team_id and user_id = auth.uid())
);

create policy "Users can view meetings for their teams" on public.meetings for select using (
  exists (select 1 from public.team_members where team_id = meetings.team_id and user_id = auth.uid())
);

create policy "Users can view their own notifications" on public.notifications for select using (
  user_id = auth.uid()
);

-- Channels
create table public.channels (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  name text not null,
  description text,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.channels on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wiki Pages
create table public.wiki_pages (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  title text not null default 'Untitled',
  content text,
  parent_id uuid references public.wiki_pages(id) on delete cascade,
  author_id uuid references public.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Phase 4
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.wiki_pages enable row level security;

create policy "Users can view channels for their teams" on public.channels for select using (
  exists (select 1 from public.team_members where team_id = channels.team_id and user_id = auth.uid())
);

create policy "Users can view messages in channels" on public.messages for select using (
  exists (select 1 from public.channels c join public.team_members tm on c.team_id = tm.team_id where c.id = messages.channel_id and tm.user_id = auth.uid())
);

create policy "Users can view wiki pages for their teams" on public.wiki_pages for select using (
  exists (select 1 from public.team_members where team_id = wiki_pages.team_id and user_id = auth.uid())
);
