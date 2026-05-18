-- 직원 관리 테이블
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_id text not null unique,
  name text not null,
  department text not null default '',
  position text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_employee_id on public.employees (employee_id);
create index if not exists employees_department on public.employees (department);

-- RLS는 비활성화 (Service Role Key로만 접근)
-- 필요에 따라 RLS 활성화 가능
