import { readFile } from "node:fs/promises";
import { Client } from "pg";

const c = new Client({
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.weufjnskpjxfmdnwault",
  password: process.env.PGPASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await c.connect();
console.log("Connected. Dropping prior objects...");
await c.query(`
  drop table if exists activity_log cascade;
  drop table if exists renewals cascade;
  drop table if exists vehicles cascade;
  drop table if exists customers cascade;
  drop type if exists renewal_status cascade;
  drop type if exists renewal_kind cascade;
  drop function if exists set_updated_at() cascade;
`);
console.log("Dropped. Running fresh migration...");
const sql = await readFile("supabase/migrations/0001_init.sql", "utf8");
await c.query(sql);
const { rows } = await c.query(
  "select table_name from information_schema.tables where table_schema='public' order by table_name"
);
console.log("Public tables:", rows.map((r) => r.table_name).join(", "));
await c.end();
