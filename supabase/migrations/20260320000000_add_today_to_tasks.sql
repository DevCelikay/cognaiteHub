-- Add "today" flag to tasks
alter table public.tasks add column today boolean default false not null;
