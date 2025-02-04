import { Pool } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import applyAllMigrations from "./migrations/index.ts";

const DATABASE_USER = Deno.env.get("POSTGRES_USER");
const DATABASE_PASSWORD = Deno.env.get("POSTGRES_PASSWORD");
const DATABASE_NAME = Deno.env.get("POSTGRES_DB");
const DATABASE_HOSTNAME = Deno.env.get("POSTGRES_SERVER") ?? "localhost";
const DATABASE_PORT = Deno.env.get("POSTGRES_PORT") ?? 5432;

const databasePool = new Pool(
  {
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    hostname: DATABASE_HOSTNAME,
    port: +DATABASE_PORT,
  },
  48, // number of connections
  true, // lazy loading
);

export async function initDatabase() {
  using client = await databasePool.connect();
  applyAllMigrations(client);
}

export default databasePool;
