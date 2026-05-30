alter table incoming_orders drop constraint if exists incoming_orders_kind_check;
alter table incoming_orders add constraint incoming_orders_kind_check
  check (kind in ('insurance','road_tax','puspakom','permit','audit_icop'));
