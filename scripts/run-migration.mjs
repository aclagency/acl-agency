import { readFile } from "node:fs/promises";
import { Client } from "pg";

const password = process.env.PGPASSWORD;
if (!password) {
  console.error("Set PGPASSWORD env var first.");
  process.exit(1);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <path-to.sql>");
  process.exit(1);
}

const sql = await readFile(file, "utf8");

const host = process.env.PGHOST || "aws-0-ap-southeast-1.pooler.supabase.com";
const port = Number(process.env.PGPORT || 5432);
const user = process.env.PGUSER || "postgres.weufjnskpjxfmdnwault";

const client = new Client({
  host,
  port,
  user,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
console.log(`Connecting to ${user}@${host}:${port}...`);

try {
  await client.connect();
  console.log("Connected. Running migration...");
  await client.query(sql);
  console.log("Migration ran successfully.");

  const { rows } = await client.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name"
  );
  console.log("Public tables:", rows.map((r) => r.table_name).join(", "));
} catch (err) {
  console.error("ERROR:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
