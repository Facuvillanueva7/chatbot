create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  channel text not null default 'whatsapp',
  sender text not null,
  original_message text not null,
  parsed_json jsonb not null,
  status text not null default 'new',
  confidence numeric,
  items jsonb not null default '[]'::jsonb,
  fulfillment text,
  address text,
  requested_time text,
  payment_method text
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status on public.orders (status);
