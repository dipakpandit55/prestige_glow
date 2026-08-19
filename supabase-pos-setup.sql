-- ============================================================
-- Prestige Glow — POS setup
-- Run this in your Supabase project (SQL Editor) once.
-- Project: qiqtytfrvnnxxbzapoyc
-- ============================================================

-- 1) Sales table -------------------------------------------------
create table if not exists public.sales (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  staff_email     text,
  customer_name   text,
  customer_phone  text,
  items           jsonb       not null default '[]'::jsonb,  -- [{name, price, qty}]
  subtotal        numeric(12,2) not null default 0,
  discount_type   text,                                       -- 'percent' | 'amount' | null
  discount_value  numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  tax_rate        numeric(5,2)  not null default 0,           -- e.g. 13 for 13% VAT
  tax_amount      numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  payment_method  text                                        -- 'cash' | 'card' | 'esewa' | 'khalti'
);

create index if not exists sales_created_at_idx on public.sales (created_at desc);

-- 2) Row Level Security -----------------------------------------
alter table public.sales enable row level security;

-- Only logged-in staff (authenticated role) can read/write sales.
drop policy if exists "staff can read sales"   on public.sales;
drop policy if exists "staff can insert sales" on public.sales;

create policy "staff can read sales"
  on public.sales for select
  to authenticated
  using (true);

create policy "staff can insert sales"
  on public.sales for insert
  to authenticated
  with check (true);

-- ============================================================
-- 3) Create staff login accounts
-- ============================================================
-- The POS uses Supabase Auth (email + password). Create staff users in:
--   Dashboard -> Authentication -> Users -> "Add user"
--   Enable "Auto Confirm User" so they can log in immediately.
-- Each staff member then logs into pos.html with that email + password.
-- ============================================================
