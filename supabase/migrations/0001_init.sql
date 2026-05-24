-- ACL-ANN sales pipeline — initial schema
-- Run in Supabase SQL Editor (or via supabase CLI).

create extension if not exists "pgcrypto";

-- customers: each row = one company we serve
create table customers (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  tin_number    text,
  phone         text,
  pic_name      text,
  notes         text,
  blacklist     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index customers_company_tin_unique
  on customers (company_name, coalesce(tin_number, ''));

-- vehicles: one row per vehicle, many vehicles per customer
create table vehicles (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references customers(id) on delete cascade,
  plate_no      text not null,
  trailer_no    text,
  vehicle_type  text,
  id_no         text,
  id_2          text,
  year_made     int,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index vehicles_plate_unique on vehicles (plate_no);
create index vehicles_customer_idx on vehicles (customer_id);

-- renewals: one row per (vehicle, kind, cycle). The core operational table.
create type renewal_kind   as enum ('road_tax','insurance','puspakom','permit');
create type renewal_status as enum (
  'pending',
  'reminded',
  'awaiting_reply',
  'awaiting_payment',
  'closed_won',
  'closed_lost',
  'bad_debt'
);

create table renewals (
  id              uuid primary key default gen_random_uuid(),
  vehicle_id      uuid not null references vehicles(id) on delete cascade,
  kind            renewal_kind not null,
  due_date        date not null,
  status          renewal_status not null default 'pending',
  ncd_percent     int,
  last_action_at  timestamptz not null default now(),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index renewals_due_idx     on renewals (due_date);
create index renewals_status_idx  on renewals (status);
create index renewals_vehicle_idx on renewals (vehicle_id);

-- activity_log: append-only audit of status changes / notes
create table activity_log (
  id           uuid primary key default gen_random_uuid(),
  renewal_id   uuid not null references renewals(id) on delete cascade,
  from_status  renewal_status,
  to_status    renewal_status,
  note         text,
  at           timestamptz not null default now()
);
create index activity_log_renewal_idx on activity_log (renewal_id, at desc);

-- updated_at auto-touch
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger customers_updated_at before update on customers
  for each row execute function set_updated_at();
create trigger vehicles_updated_at  before update on vehicles
  for each row execute function set_updated_at();
create trigger renewals_updated_at  before update on renewals
  for each row execute function set_updated_at();
