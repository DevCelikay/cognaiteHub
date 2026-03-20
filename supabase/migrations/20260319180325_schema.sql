-- =============================================================
-- CognaiteHub Database Schema
-- Run this in Supabase SQL Editor
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Tables
-- ─────────────────────────────────────────────────────────────

-- 1.1 Clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.2 Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'active' not null check (status in ('active', 'archived')),
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.3 Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  completed boolean default false not null,
  position integer default 0 not null,
  project_id uuid references public.projects(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.4 Notes
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  content text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.5 Transcripts
create table public.transcripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  content text,
  source text,
  recorded_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─────────────────────────────────────────────────────────────
-- STEP 2: Updated_at trigger function
-- ─────────────────────────────────────────────────────────────

-- 2.1 Shared trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────
-- STEP 3: Attach updated_at triggers to each table
-- ─────────────────────────────────────────────────────────────

-- 3.1 clients
create trigger clients_updated_at before update on public.clients
  for each row execute function public.handle_updated_at();

-- 3.2 projects
create trigger projects_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

-- 3.3 tasks
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.handle_updated_at();

-- 3.4 notes
create trigger notes_updated_at before update on public.notes
  for each row execute function public.handle_updated_at();

-- 3.5 transcripts
create trigger transcripts_updated_at before update on public.transcripts
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- STEP 4: Enable Row Level Security
-- ─────────────────────────────────────────────────────────────

-- 4.1 clients
alter table public.clients enable row level security;

-- 4.2 projects
alter table public.projects enable row level security;

-- 4.3 tasks
alter table public.tasks enable row level security;

-- 4.4 notes
alter table public.notes enable row level security;

-- 4.5 transcripts
alter table public.transcripts enable row level security;

-- ─────────────────────────────────────────────────────────────
-- STEP 5: RLS policies — direct user_id tables
-- ─────────────────────────────────────────────────────────────

-- 5.1 Clients
create policy "Users can view own clients" on public.clients
  for select using (auth.uid() = user_id);
create policy "Users can insert own clients" on public.clients
  for insert with check (auth.uid() = user_id);
create policy "Users can update own clients" on public.clients
  for update using (auth.uid() = user_id);
create policy "Users can delete own clients" on public.clients
  for delete using (auth.uid() = user_id);

-- 5.2 Projects
create policy "Users can view own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- 5.3 Tasks
create policy "Users can view own tasks" on public.tasks
  for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- STEP 6: RLS policies — project-owned tables (join through projects)
-- ─────────────────────────────────────────────────────────────

-- 6.1 Notes
create policy "Users can view notes on own projects" on public.notes
  for select using (
    exists (select 1 from public.projects where id = notes.project_id and user_id = auth.uid())
  );
create policy "Users can insert notes on own projects" on public.notes
  for insert with check (
    exists (select 1 from public.projects where id = notes.project_id and user_id = auth.uid())
  );
create policy "Users can update notes on own projects" on public.notes
  for update using (
    exists (select 1 from public.projects where id = notes.project_id and user_id = auth.uid())
  );
create policy "Users can delete notes on own projects" on public.notes
  for delete using (
    exists (select 1 from public.projects where id = notes.project_id and user_id = auth.uid())
  );

-- 6.2 Transcripts
create policy "Users can view transcripts on own projects" on public.transcripts
  for select using (
    exists (select 1 from public.projects where id = transcripts.project_id and user_id = auth.uid())
  );
create policy "Users can insert transcripts on own projects" on public.transcripts
  for insert with check (
    exists (select 1 from public.projects where id = transcripts.project_id and user_id = auth.uid())
  );
create policy "Users can update transcripts on own projects" on public.transcripts
  for update using (
    exists (select 1 from public.projects where id = transcripts.project_id and user_id = auth.uid())
  );
create policy "Users can delete transcripts on own projects" on public.transcripts
  for delete using (
    exists (select 1 from public.projects where id = transcripts.project_id and user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────
-- STEP 7: Performance indexes
-- ─────────────────────────────────────────────────────────────

-- 7.1 clients
create index clients_user_id_idx on public.clients(user_id);

-- 7.2 projects
create index projects_user_id_idx on public.projects(user_id);
create index projects_client_id_idx on public.projects(client_id);

-- 7.3 tasks
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_project_id_idx on public.tasks(project_id);

-- 7.4 notes
create index notes_project_id_idx on public.notes(project_id);

-- 7.5 transcripts
create index transcripts_project_id_idx on public.transcripts(project_id);
