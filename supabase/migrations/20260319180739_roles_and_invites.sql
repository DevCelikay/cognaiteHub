-- =============================================================
-- 002: User roles & invitations
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Profiles table
-- ─────────────────────────────────────────────────────────────

-- 1.1 Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 1.2 Enable RLS
alter table public.profiles enable row level security;

-- 1.3 RLS policies — all authenticated users can read profiles, only own profile editable
create policy "Authenticated users can view all profiles" on public.profiles
  for select using (auth.uid() is not null);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "System can insert profiles" on public.profiles
  for insert with check (true);

-- 1.4 Updated_at trigger
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- STEP 2: Auto-create profile on user signup
-- ─────────────────────────────────────────────────────────────

-- 2.1 Trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when (select count(*) from public.profiles) = 0 then 'owner'
      else 'member'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2.2 Attach to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- STEP 3: Seed current user as owner
-- ─────────────────────────────────────────────────────────────

-- 3.1 Backfill existing users into profiles
insert into public.profiles (id, email, role)
select id, email, 'owner'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- STEP 4: Indexes
-- ─────────────────────────────────────────────────────────────

-- 4.1 Profiles
create index profiles_role_idx on public.profiles(role);
