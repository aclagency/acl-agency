create table if not exists incoming_orders (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  company_name text not null,
  plate_no     text not null,
  kind         text not null check (kind in ('insurance','road_tax','puspakom','permit')),
  pic_name     text,
  notes        text,
  status       text not null default 'pending' check (status in ('pending','done')),
  done_at      timestamptz
);

create index if not exists incoming_orders_created_idx on incoming_orders (created_at desc);
create index if not exists incoming_orders_status_idx  on incoming_orders (status);
