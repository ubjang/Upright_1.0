-- 청렴 바이브: 체크인 / 퀴즈 (본인만 RLS)
-- Supabase 대시보드에서 Authentication > Providers > Anonymous 활성화 필요

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  submitted_at timestamptz not null default now(),
  selected_phrases jsonb not null default '[]'::jsonb,
  month_key text not null,
  submission_day smallint not null check (submission_day in (1, 15)),
  unique (user_id, month_key, submission_day)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  submitted_at timestamptz not null default now(),
  answers jsonb not null default '{}'::jsonb,
  month_key text not null,
  submission_day smallint not null check (submission_day in (1, 15)),
  unique (user_id, month_key, submission_day)
);

create index if not exists check_ins_user_month on public.check_ins (user_id, month_key);
create index if not exists quiz_attempts_user_month on public.quiz_attempts (user_id, month_key);

alter table public.check_ins enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "check_ins_select_own"
  on public.check_ins for select
  using (auth.uid() = user_id);

create policy "check_ins_insert_own"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

create policy "check_ins_update_own"
  on public.check_ins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "check_ins_delete_own"
  on public.check_ins for delete
  using (auth.uid() = user_id);

create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "quiz_attempts_update_own"
  on public.quiz_attempts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_attempts_delete_own"
  on public.quiz_attempts for delete
  using (auth.uid() = user_id);

-- INSERT 시 클라이언트가 user_id를 보내지 않아도 auth.uid()로 설정
create or replace function public.set_owner_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists check_ins_set_user on public.check_ins;
create trigger check_ins_set_user
  before insert on public.check_ins
  for each row execute function public.set_owner_user_id();

drop trigger if exists quiz_attempts_set_user on public.quiz_attempts;
create trigger quiz_attempts_set_user
  before insert on public.quiz_attempts
  for each row execute function public.set_owner_user_id();
