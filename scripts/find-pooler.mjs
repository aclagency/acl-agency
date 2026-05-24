import { Client } from "pg";

const password = process.env.PGPASSWORD;
if (!password) { console.error("no PGPASSWORD"); process.exit(1); }

const projectRef = "weufjnskpjxfmdnwault";
const regions = [
  "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2",
  "ap-south-1", "ap-east-1", "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "sa-east-1", "ca-central-1",
];

for (const r of regions) {
  for (const prefix of ["aws-0", "aws-1"]) {
    const host = `${prefix}-${r}.pooler.supabase.com`;
    const c = new Client({
      host, port: 6543, user: `postgres.${projectRef}`,
      password, database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    try {
      await c.connect();
      console.log(`FOUND: ${host}:6543`);
      await c.end();
      process.exit(0);
    } catch (e) {
      const msg = e.message.split("\n")[0];
      if (!msg.includes("ENOTFOUND") && !msg.includes("tenant") && !msg.includes("getaddrinfo")) {
        console.log(`MAYBE ${host}: ${msg}`);
      }
      try { await c.end(); } catch {}
    }
  }
}
console.log("none found");
